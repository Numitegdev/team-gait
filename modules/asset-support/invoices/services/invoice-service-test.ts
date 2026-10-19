import {
  isFriendshipLoan,
  getFirstInvoicePeriod,
  isLoanBillableForInvoice,
} from "./invoice-service";

function test(
  name: string,
  actual: boolean,
  expected: boolean
) {
  const result =
    actual === expected
      ? "PASS"
      : "FAIL";

  console.log(
    `${result} - ${name}`
  );

  if (actual !== expected) {
    console.error(
      `  Expected: ${expected}`
    );

    console.error(
      `  Actual:   ${actual}`
    );
  }
}

function testPeriod(
  name: string,
  actual: {
    month: number;
    year: number;
  },
  expected: {
    month: number;
    year: number;
  }
) {
  const pass =
    actual.month === expected.month &&
    actual.year === expected.year;

  console.log(
    `${pass ? "PASS" : "FAIL"} - ${name}`
  );

  if (!pass) {
    console.error(
      `  Expected: ${expected.month}/${expected.year}`
    );

    console.error(
      `  Actual:   ${actual.month}/${actual.year}`
    );
  }
}

/* =====================================================
   FRIENDSHIP LOAN
===================================================== */

test(
  "26 Okt → 1 Nov = friendship",
  isFriendshipLoan({
    start_date: "2026-10-26",
    end_date: "2026-11-01",
    returned_at: null,
    status: "RETURNED",
  } as any),
  true
);

test(
  "26 Okt → 2 Nov = bukan friendship",
  isFriendshipLoan({
    start_date: "2026-10-26",
    end_date: "2026-11-02",
    returned_at: null,
    status: "RETURNED",
  } as any),
  false
);

test(
  "1 Nov → 5 Nov = friendship",
  isFriendshipLoan({
    start_date: "2026-11-01",
    end_date: "2026-11-05",
    returned_at: null,
    status: "RETURNED",
  } as any),
  true
);

test(
  "1 Nov → 8 Nov = bukan friendship",
  isFriendshipLoan({
    start_date: "2026-11-01",
    end_date: "2026-11-08",
    returned_at: null,
    status: "RETURNED",
  } as any),
  false
);


/* =====================================================
   FIRST INVOICE PERIOD
===================================================== */

testPeriod(
  "10 Okt → invoice Oktober",
  getFirstInvoicePeriod("2026-10-10"),
  {
    month: 10,
    year: 2026,
  }
);

testPeriod(
  "25 Okt → invoice Oktober",
  getFirstInvoicePeriod("2026-10-25"),
  {
    month: 10,
    year: 2026,
  }
);

testPeriod(
  "26 Okt → invoice November",
  getFirstInvoicePeriod("2026-10-26"),
  {
    month: 11,
    year: 2026,
  }
);

testPeriod(
  "1 Nov → invoice November",
  getFirstInvoicePeriod("2026-11-01"),
  {
    month: 11,
    year: 2026,
  }
);


/* =====================================================
   BILLING
===================================================== */

test(
  "10 Okt → 20 Okt = invoice Oktober",
  isLoanBillableForInvoice(
    {
      start_date: "2026-10-10",
      end_date: "2026-10-20",
      returned_at: "2026-10-20",
      status: "RETURNED",
    } as any,
    10,
    2026
  ),
  true
);

test(
  "10 Okt → 24 Okt = invoice Oktober",
  isLoanBillableForInvoice(
    {
      start_date: "2026-10-10",
      end_date: "2026-10-24",
      returned_at: "2026-10-24",
      status: "RETURNED",
    } as any,
    10,
    2026
  ),
  true
);

test(
  "10 Okt → 26 Okt = invoice Oktober",
  isLoanBillableForInvoice(
    {
      start_date: "2026-10-10",
      end_date: "2026-10-26",
      returned_at: "2026-10-26",
      status: "RETURNED",
    } as any,
    10,
    2026
  ),
  true
);

test(
  "26 Okt → 1 Nov = tidak invoice",
  isLoanBillableForInvoice(
    {
      start_date: "2026-10-26",
      end_date: "2026-11-01",
      returned_at: "2026-11-01",
      status: "RETURNED",
    } as any,
    11,
    2026
  ),
  false
);

test(
  "26 Okt → 2 Nov = invoice November",
  isLoanBillableForInvoice(
    {
      start_date: "2026-10-26",
      end_date: "2026-11-02",
      returned_at: "2026-11-02",
      status: "RETURNED",
    } as any,
    11,
    2026
  ),
  true
);

test(
  "26 Okt → 5 Nov = invoice November",
  isLoanBillableForInvoice(
    {
      start_date: "2026-10-26",
      end_date: "2026-11-05",
      returned_at: "2026-11-05",
      status: "RETURNED",
    } as any,
    11,
    2026
  ),
  true
);

test(
  "26 Okt → masih ACTIVE = invoice November",
  isLoanBillableForInvoice(
    {
      start_date: "2026-10-26",
      end_date: null,
      returned_at: null,
      status: "ACTIVE",
    } as any,
    11,
    2026
  ),
  true
);