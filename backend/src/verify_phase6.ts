import prisma from "./lib/prisma";
import { CustomerService } from "./modules/customers/service";
import { ShiftService } from "./modules/shifts/service";
import { SettingService } from "./modules/settings/service";
import { ComputerService } from "./modules/computers/service";
import { OrderService } from "./modules/orders/service";
import bcrypt from "bcrypt";

async function runVerification() {
  console.log("=== Phase 6 Verification Script Started ===");

  // 1. Initialize test users
  console.log("\n1. Initializing test Admin and Customer...");
  const adminEmail = "admin_verify@cclub.com";
  const customerEmail = "customer_verify@cclub.com";

  // Clean up any old verification users first
  await prisma.activityLog.deleteMany({
    where: {
      actor: { email: { in: [adminEmail, customerEmail] } }
    }
  });

  await prisma.user.deleteMany({
    where: { email: { in: [adminEmail, customerEmail] } }
  });

  const passwordHash = await bcrypt.hash("verify123", 10);
  const admin = await prisma.user.create({
    data: {
      name: "Verification Admin",
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
    },
  });

  const customer = await prisma.user.create({
    data: {
      name: "Verification Customer",
      email: customerEmail,
      passwordHash,
      role: "CUSTOMER",
    },
  });

  console.log(`Admin created: ${admin.id}`);
  console.log(`Customer created: ${customer.id}`);

  // 2. Open a new shift
  console.log("\n2. Opening a new shift...");
  // First ensure no open shift exists
  const currentOpen = await prisma.shift.findFirst({ where: { closedAt: null } });
  if (currentOpen) {
    console.log(`Closing existing open shift: ${currentOpen.id}`);
    await ShiftService.closeShift(currentOpen.id);
  }

  const shift = await ShiftService.openShift(admin.id);
  console.log(`New Shift opened: ${shift.id}`);

  // 3. Update zone prices via settings
  console.log("\n3. Updating zone prices via Settings...");
  // Standard -> 12,000 UZS, VIP -> 18,000 UZS, PS5 -> 24,000 UZS
  await SettingService.upsertSetting("zone_prices", {
    standard: 12000,
    vip: 18000,
    ps5: 24000,
  });

  // Verify synchronization in the database
  console.log("Verifying Computer hourlyRates synchronization...");
  const standardPc = await prisma.computer.findFirst({ where: { zone: "STANDARD" } });
  const vipPc = await prisma.computer.findFirst({ where: { zone: "VIP" } });
  const ps5Pc = await prisma.computer.findFirst({ where: { zone: "PS5" } });

  console.log(`Standard PC hourly rate: ${standardPc?.hourlyRate} (expected: 12000)`);
  console.log(`VIP PC hourly rate: ${vipPc?.hourlyRate} (expected: 18000)`);
  console.log(`PS5 PC hourly rate: ${ps5Pc?.hourlyRate} (expected: 24000)`);

  if (standardPc?.hourlyRate !== 12000 || vipPc?.hourlyRate !== 18000 || ps5Pc?.hourlyRate !== 24000) {
    throw new Error("ZONE PRICES SYNCHRONIZATION FAILED!");
  }
  console.log("Zone prices synchronization verified successfully.");

  // 4. Create test sessions
  console.log("\n4. Creating test sessions...");
  if (!standardPc || !vipPc) {
    throw new Error("No computers found in standard/vip zones. Seed database first.");
  }

  // Start sessions
  // CustomerName set to the verification customer name
  const session1 = await ComputerService.startSession({
    computerId: standardPc.id,
    durationMinutes: 120,
    customerName: customer.name,
  }, admin.id);

  const session2 = await ComputerService.startSession({
    computerId: vipPc.id,
    durationMinutes: 120,
    customerName: customer.name,
  }, admin.id);

  // Link customer's userId to session1 & session2
  await prisma.session.update({
    where: { id: session1.id },
    data: { userId: customer.id }
  });
  await prisma.session.update({
    where: { id: session2.id },
    data: { userId: customer.id }
  });

  console.log(`Session 1 started on PC ${standardPc.number}: ${session1.id}`);
  console.log(`Session 2 started on PC ${vipPc.number}: ${session2.id}`);

  // Hack startedAt to be 2 hours ago so we have elapsed time of exactly 2 hours (120 mins)
  const twoHoursAgo = new Date(Date.now() - 120 * 60 * 1000);
  await prisma.session.update({
    where: { id: session1.id },
    data: { startedAt: twoHoursAgo }
  });
  await prisma.session.update({
    where: { id: session2.id },
    data: { startedAt: twoHoursAgo }
  });

  // 5. Create test product & orders
  console.log("\n5. Creating test product and orders...");
  const product = await prisma.product.create({
    data: {
      name: "Verify Soda 0.5L",
      category: "DRINK",
      price: 8500,
      stock: 100,
    }
  });
  console.log(`Product created: ${product.name} (price: ${product.price})`);

  // Create Order 1 linked to Session 1 (2 sodas = 17,000 UZS)
  const order1 = await OrderService.createOrder({
    sessionId: session1.id,
    items: [{ productId: product.id, qty: 2 }]
  }, admin.id);

  // Create Order 2 linked to Session 2 (1 soda = 8,500 UZS)
  const order2 = await OrderService.createOrder({
    sessionId: session2.id,
    items: [{ productId: product.id, qty: 1 }]
  }, admin.id);

  console.log(`Order 1 created: ${order1.id} (total: ${order1.total})`);
  console.log(`Order 2 created: ${order2.id} (total: ${order2.total})`);

  // 6. Stop/complete sessions (triggers totalAmount calculation)
  console.log("\n6. Completing sessions to calculate total PC amount...");
  const endedSession1 = await ComputerService.stopSession(session1.id, admin.id);
  const endedSession2 = await ComputerService.stopSession(session2.id, admin.id);

  const amount1 = endedSession1.totalAmount || 0;
  const amount2 = endedSession2.totalAmount || 0;
  console.log(`Session 1 ended. totalAmount: ${amount1}`);
  console.log(`Session 2 ended. totalAmount: ${amount2}`);

  const expectedPcRevenue = amount1 + amount2;
  const expectedBarRevenue = order1.total + order2.total;
  const expectedTotalSpent = expectedPcRevenue + expectedBarRevenue;

  // 7. Close the Shift
  console.log("\n7. Closing shift...");
  const closedShift = await ShiftService.closeShift(shift.id);

  console.log(`Shift Closed: ${closedShift.id}`);
  console.log(`PC Revenue: ${closedShift.totalPcRevenue} (expected: ${expectedPcRevenue})`);
  console.log(`Bar Revenue: ${closedShift.totalBarRevenue} (expected: ${expectedBarRevenue})`);

  if (closedShift.totalPcRevenue !== expectedPcRevenue || closedShift.totalBarRevenue !== expectedBarRevenue) {
    throw new Error("REVENUE CALCULATION INCORRECT!");
  }
  console.log("Shift revenue verified successfully.");

  // 8. Verify Customer stats aggregation
  console.log("\n8. Verifying Customers statistical aggregation...");
  const customers = await CustomerService.getAllCustomers();
  const verifyCustomer = customers.find(c => c.id === customer.id);

  console.log(`Customer sessionsCount: ${verifyCustomer?.sessionsCount} (expected: 2)`);
  console.log(`Customer totalSpent: ${verifyCustomer?.totalSpent} (expected: ${expectedTotalSpent})`);
  console.log(`Customer lastVisit: ${verifyCustomer?.lastVisit?.toISOString()}`);

  if (verifyCustomer?.sessionsCount !== 2 || verifyCustomer?.totalSpent !== expectedTotalSpent) {
    throw new Error("CUSTOMER STATS AGGREGATION INCORRECT!");
  }
  console.log("Customer stats aggregation verified successfully.");

  // Verify Customer Detail
  console.log("Verifying Customer detail endpoint...");
  const detail = await CustomerService.getCustomerDetail(customer.id);
  console.log(`Detail sessions length: ${detail.sessions.length} (expected: 2)`);
  console.log(`Detail orders length: ${detail.orders.length} (expected: 2)`);

  if (detail.sessions.length !== 2 || detail.orders.length !== 2) {
    throw new Error("CUSTOMER DETAIL VERIFICATION FAILED!");
  }
  console.log("Customer detail verified successfully.");

  // 9. Clean up test records
  console.log("\n9. Cleaning up verification database entries...");
  await prisma.$transaction(async (tx) => {
    // Delete order items
    await tx.orderItem.deleteMany({
      where: { orderId: { in: [order1.id, order2.id] } }
    });
    // Delete orders
    await tx.order.deleteMany({
      where: { id: { in: [order1.id, order2.id] } }
    });
    // Delete product
    await tx.product.delete({
      where: { id: product.id }
    });
    // Delete activity logs
    await tx.activityLog.deleteMany({
      where: {
        actorId: { in: [admin.id, customer.id] }
      }
    });
    // Delete sessions
    await tx.session.deleteMany({
      where: { id: { in: [session1.id, session2.id] } }
    });
    // Delete shift
    await tx.shift.delete({
      where: { id: shift.id }
    });
    // Delete users
    await tx.user.deleteMany({
      where: { id: { in: [admin.id, customer.id] } }
    });
  });

  // Restore defaults
  await SettingService.upsertSetting("zone_prices", {
    standard: 10000,
    vip: 15000,
    ps5: 20000,
  });

  console.log("\nCleanup done!");
  console.log("=== All Verification Steps Passed Successfully! ===");
}

runVerification()
  .catch((err) => {
    console.error("\n❌ Verification Failed:", err.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
