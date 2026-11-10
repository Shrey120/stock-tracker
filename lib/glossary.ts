/**
 * Plain-language meanings for the jargon on cards. Keys are matched as whole words.
 * Acronyms match exactly; word terms also match their capitalised form.
 */
const ACRONYMS: Record<string, string> = {
  RSI: "Relative Strength Index. A 0–100 score of how hard the price has been pushed up or down lately. Above 70 = rose very fast, often due for a breather. Below 30 = fell very fast.",
  MACD: "A momentum signal comparing a short-term and a long-term average price. When its line is above its signal line, buyers have the upper hand.",
  DMA: "Day Moving Average: the average closing price over the last N days. Smooths out daily noise to show the trend.",
  "50DMA": "Average closing price of the last 50 trading days (about 2.5 months). Shows the medium-term trend.",
  "200DMA": "Average closing price of the last 200 trading days (about 10 months). Price above it usually means a long-term uptrend.",
  ATR: "Average True Range: how much the price normally moves in a day, in rupees. Used to keep stop-losses outside normal daily wobble.",
  "P/E": "Price-to-Earnings: how many rupees you pay for ₹1 of the company's yearly profit. Higher = more expensive, or more growth expected.",
  "P/B": "Price-to-Book: share price compared with the company's net assets per share. Mainly used for banks. Higher = more expensive.",
  PEG: "P/E divided by profit growth rate. Around 1 = price fair for the growth; well above 1 = paying a lot for the growth.",
  "EV/EBITDA": "Company value (including debt) compared with its operating profit. Like P/E, but fairer across companies with different debt.",
  EBITDA: "Operating profit before interest, tax and depreciation. Shows how much the core business earns.",
  ROE: "Return on Equity: profit made for every ₹100 of shareholders' money. Above 15% is good.",
  ROCE: "Return on Capital Employed: profit made on all money used in the business (own + borrowed). Above 15% is good.",
  PAT: "Profit After Tax: the company's final profit, after all costs and taxes.",
  EPS: "Earnings Per Share: yearly profit divided by number of shares. Your share of the profit for each share you own.",
  NII: "Net Interest Income: what a bank earns from loans minus what it pays on deposits. A bank's main income.",
  NIM: "Net Interest Margin: a bank's lending profit as a % of its loans. Higher = more profitable lending.",
  CASA: "Current + Savings Account deposits as a % of all deposits. These are cheap for a bank, so a higher CASA means cheaper money to lend.",
  CAR: "Capital Adequacy Ratio: a bank's safety cushion of its own money vs its loans. RBI requires a minimum; higher = safer.",
  CET1: "The strongest part of a bank's capital cushion (pure shareholder money). Higher = safer.",
  GNPA: "Gross Non-Performing Assets: loans where borrowers stopped paying, as a % of all loans. Lower is better.",
  NNPA: "Net NPA: bad loans left after the money the bank has already set aside for them. Lower is better.",
  NPA: "Non-Performing Asset: a loan where the borrower has stopped paying for 90+ days.",
  FII: "Foreign Institutional Investors: big overseas funds. When they buy, large Indian stocks usually rise; when they sell, they fall.",
  FPI: "Foreign Portfolio Investors: same idea as FII, overseas funds investing in Indian markets.",
  DII: "Domestic Institutional Investors: Indian mutual funds, insurers and pension funds.",
  "D/E": "Debt-to-Equity: borrowed money vs shareholders' money. Below 1 is comfortable; above 2 means heavy borrowing.",
  FCF: "Free Cash Flow: cash left after running the business and paying for new equipment. Real cash, not just accounting profit.",
  CFO: "Cash From Operations: actual cash the business brought in during the year.",
  CAGR: "Compound Annual Growth Rate: the average yearly growth over several years.",
  YoY: "Year on Year: compared with the same period last year.",
  QoQ: "Quarter on Quarter: compared with the previous three months.",
  TTM: "Trailing Twelve Months: the last four quarters added together.",
  CMP: "Current Market Price: the latest share price.",
  Mcap: "Market capitalisation: share price × number of shares. The total value of the company on the stock market.",
  NAV: "Net Asset Value: the true value of what an ETF or fund holds, per unit.",
  ETF: "Exchange Traded Fund: a basket (e.g. gold, IT stocks) you buy and sell like a single share.",
  CPI: "Consumer Price Index: India's main inflation number. High inflation makes rate cuts less likely.",
  RBI: "Reserve Bank of India. Sets interest rates; rate cuts usually help banks, borrowers and the stock market.",
  MPC: "The RBI's Monetary Policy Committee, which decides interest rates.",
  Nifty: "Nifty 50: index of India's 50 biggest companies. Used as 'the market'.",
  "Bank Nifty": "Index of the biggest Indian bank stocks.",
  Brent: "The global benchmark price of crude oil. Higher oil hurts India's inflation and many companies' costs.",
  ESOP: "Employee Stock Options: shares given to staff as pay. Slightly increases the share count.",
  LDR: "Loan-to-Deposit Ratio: how much of a bank's deposits are lent out.",
};

const WORDS: Record<string, string> = {
  support: "A price level where buyers have stepped in before, so the fall often pauses there.",
  resistance: "A price level where sellers have taken over before, so the rise often pauses there.",
  trigger: "A pre-decided price. If the stock closes below it, you act (trim or sell) instead of hoping.",
  "stop-loss": "A price where you sell to limit the loss if the stock keeps falling.",
  stop: "The price where you sell to limit the loss if the stock keeps falling. Always on a daily closing price.",
  "daily close": "The last price at 3:30 pm. Levels use this, so a brief intraday dip doesn't count.",
  overbought: "The price rose so fast that a pause or pullback is common soon. Not a sell signal by itself.",
  oversold: "The price fell so fast that a bounce is common soon. Not a buy signal by itself.",
  uptrend: "Price making higher highs and higher lows, above its long-term average.",
  downtrend: "Price making lower highs and lower lows, below its long-term average.",
  consolidation: "The price moving sideways in a range, catching its breath after a big move.",
  breakout: "Price closing above a level it couldn't cross before, often with high volume.",
  pullback: "A short dip within a bigger rise. Often a better time to buy than after a sharp jump.",
  volume: "How many shares changed hands. A move on high volume is more convincing.",
  momentum: "How strongly the price is moving in one direction right now.",
  beta: "How much the stock swings vs the market. Below 1 = calmer than the market; above 1 = swings more.",
  promoter: "The founders or owning group of the company. Promoters buying more is usually a confidence signal.",
  pledge: "Promoters borrowing money against their shares. High pledging is risky: a fall can force them to sell.",
  "dividend yield": "Yearly dividend as a % of the share price. Like interest on the shares.",
  "book value": "What the company's assets minus debts are worth per share, on paper.",
  guidance: "What the company's management says it expects to earn or sell this year.",
  advances: "A bank's word for the loans it has given out.",
  provisions: "Money a bank sets aside for loans that may not be repaid.",
  "interest cover": "How many times operating profit covers the interest bill. Above 3x is healthy.",
  "current ratio": "Short-term assets vs short-term bills. Above 1.5 means bills can be paid comfortably.",
  "cash conversion": "How much of the reported profit actually arrived as cash.",
  "debtor days": "How many days customers take to pay. Rising debtor days means money is stuck.",
  "52-week high": "The highest price in the last year.",
  "52w high": "The highest price in the last year.",
  tranche: "One part of a planned purchase. Buying in tranches spreads your entry price.",
  "15% cap": "Your rule: no single stock above 15% of your money, so one bad stock can't hurt too much.",
  "30% limit": "Your rule: no one sector above 30% of your money.",
  "risk-on": "Investors feel confident and are buying shares.",
  "risk-off": "Investors are nervous and moving money to safety, such as gold.",
  "de-rating": "The market paying a lower multiple (e.g. P/E) for the same profit, so the price falls.",
  "re-rating": "The market paying a higher multiple for the same profit, so the price rises.",
  "industry average": "The typical value for similar companies, for comparison.",
};

export type GlossaryEntry = { term: string; meaning: string };

const entries: GlossaryEntry[] = [];
Object.entries(ACRONYMS).forEach(([term, meaning]) => entries.push({ term, meaning }));
Object.entries(WORDS).forEach(([term, meaning]) => {
  entries.push({ term, meaning });
  entries.push({ term: term.charAt(0).toUpperCase() + term.slice(1), meaning });
});
// Longest first so "Bank Nifty" wins over "Nifty" and "50DMA" over "DMA".
entries.sort((a, b) => b.term.length - a.term.length);

const lookup = new Map(entries.map((e) => [e.term, e.meaning]));
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
const pattern = new RegExp(`(?<![A-Za-z0-9])(${entries.map((e) => esc(e.term)).join("|")})(?![A-Za-z])`, "g");

export type Piece = string | { term: string; meaning: string };

/** Splits text into plain strings and glossary terms. Each term is explained only on its first appearance. */
export function splitTerms(text: string, seen?: Set<string>): Piece[] {
  const out: Piece[] = [];
  let last = 0;
  for (const m of text.matchAll(pattern)) {
    const term = m[1];
    const meaning = lookup.get(term)!;
    const key = meaning;
    if (seen?.has(key)) continue;
    seen?.add(key);
    if (m.index! > last) out.push(text.slice(last, m.index));
    out.push({ term, meaning });
    last = m.index! + term.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

export const SCENARIO_MEANING: Record<string, string> = {
  bear: "The bad-case scenario: roughly where the price could be in 9–12 months if things go wrong.",
  base: "The middle scenario: where the price could be if things go roughly to plan.",
  bull: "The good-case scenario: where the price could be if things go better than planned.",
};

export function meaningOf(term: string): string | undefined {
  return lookup.get(term);
}
