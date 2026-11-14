'use client';

import React, { useState, useEffect, useRef } from 'react';

type Lang = 'ko' | 'en' | 'ja' | 'zh';
type Theme = 'receipt' | 'tax' | 'voucher';

interface LineItem {
  id: string;
  desc: string;
  amount: string;
}

interface InvoicePayload {
  from: string;
  to: string;
  items: { desc: string; amount: number }[];
  feePercent: number;
  clause: string;
  theme: Theme;
  lang: Lang;
  docNo: string;
  date: string;
}

const I18N = {
  ko: {
    currency: '₩',
    docTitle: '청 구 서',
    docSub: 'PARODY STATEMENT OF ACCOUNT',
    docNoLabel: '문서번호',
    dateLabel: '발행일자',
    fromLabel: '청구인',
    toLabel: '피청구인',
    fromPlaceholder: '성명 또는 별칭',
    toPlaceholder: '성명 또는 별칭',
    colDesc: '내역',
    colAmount: '금액',
    itemPlaceholder: '청구 내역을 직접 입력하세요',
    amountPlaceholder: '0',
    addItemBtn: '+ 항목 추가',
    subtotal: '공급가액',
    fee: '수수료',
    total: '총 청구금액',
    clauseLabel: '특약 및 이행조건',
    clausePlaceholder: '예: 금일 24:00까지 미이행 시 커피 1잔으로 대체 청구함',
    themeLabel: '서식 선택',
    themes: {
      receipt: '영수증',
      tax: '표준청구서',
      voucher: '지출전표',
    },
    sendBtn: '청구서 발행 및 링크 복사',
    saveBtn: '이미지 파일로 저장',
    counterBtn: '이의제기 및 역청구서 발행',
    resetBtn: '신규 청구서 작성',
    adNotice: '청구서 발행 처리 중입니다...',
    copiedToast: '청구서 링크가 클립보드에 복사되었습니다.',
    stampIssued: '오락용 가상청구',
    stampDue: '장난용 / 효력없음',
    stampSubTop: 'ENTERTAINMENT',
    stampSubBottom: 'NO LEGAL EFFECT',
    docDisclaimer: '※ 본 문서는 유희 및 엔터테인먼트 목적의 가상 청구서이며 어떠한 법적 효력도 갖지 않습니다.',
    footerDisclaimer:
      '면책 및 이용 고지: 본 서비스에서 생성되는 모든 문서는 오락 목적의 가상 콘텐츠이며, 실제 채권·채무 관계나 법적 효력이 전혀 없습니다. 타인의 명의나 실제 사업자 정보를 도용하여 금전을 요구하는 행위는 엄격히 금지됩니다.',
  },
  en: {
    currency: '$',
    docTitle: 'INVOICE',
    docSub: 'PARODY STATEMENT OF ACCOUNT',
    docNoLabel: 'INVOICE NO.',
    dateLabel: 'ISSUE DATE',
    fromLabel: 'BILLED BY',
    toLabel: 'BILLED TO',
    fromPlaceholder: 'Sender Name',
    toPlaceholder: 'Recipient Name',
    colDesc: 'DESCRIPTION',
    colAmount: 'AMOUNT',
    itemPlaceholder: 'Enter line item description',
    amountPlaceholder: '0',
    addItemBtn: '+ ADD LINE ITEM',
    subtotal: 'SUBTOTAL',
    fee: 'SURCHARGE / FEE',
    total: 'TOTAL DUE',
    clauseLabel: 'TERMS & CONDITIONS',
    clausePlaceholder: 'e.g., Payable via iced coffee before midnight.',
    themeLabel: 'DOCUMENT FORMAT',
    themes: {
      receipt: 'THERMAL RECEIPT',
      tax: 'FORMAL INVOICE',
      voucher: 'DEBIT VOUCHER',
    },
    sendBtn: 'ISSUE & COPY INVOICE LINK',
    saveBtn: 'DOWNLOAD IMAGE',
    counterBtn: 'DISPUTE & ISSUE COUNTER-INVOICE',
    resetBtn: 'DRAFT NEW INVOICE',
    adNotice: 'Processing virtual invoice...',
    copiedToast: 'Invoice link copied to clipboard.',
    stampIssued: 'PARODY MEMO',
    stampDue: 'NO LEGAL EFFECT',
    stampSubTop: 'FOR FUN ONLY',
    stampSubBottom: 'NOT A REAL BILL',
    docDisclaimer: '* This is a fictional document created strictly for entertainment purposes and holds no legal validity.',
    footerDisclaimer:
      'DISCLAIMER: All documents generated on this site are parodies for entertainment only and carry zero legal or financial obligation. Impersonating third parties or real businesses to demand money is strictly prohibited.',
  },
  ja: {
    currency: '¥',
    docTitle: '請 求 書',
    docSub: 'PARODY STATEMENT OF ACCOUNT',
    docNoLabel: '請求番号',
    dateLabel: '発行日',
    fromLabel: '請求者',
    toLabel: '請求先',
    fromPlaceholder: '氏名または名称',
    toPlaceholder: '氏名または名称',
    colDesc: '品目・内容',
    colAmount: '金額',
    itemPlaceholder: '請求内容を入力してください',
    amountPlaceholder: '0',
    addItemBtn: '+ 行を追加',
    subtotal: '小計',
    fee: '手数料',
    total: '御請求合計金額',
    clauseLabel: '備考・支払条件',
    clausePlaceholder: '例：本日24時までにコーヒー1杯にて相殺可',
    themeLabel: '様式選択',
    themes: {
      receipt: 'レシート',
      tax: '標準請求書',
      voucher: '振替伝票',
    },
    sendBtn: '請求書を発行してリンクをコピー',
    saveBtn: '画像として保存',
    counterBtn: '異議申立・逆請求書を発行する',
    resetBtn: '新規請求書を作成',
    adNotice: '請求書を発行しています...',
    copiedToast: '請求書のリンクをコピーしました。',
    stampIssued: 'ジョーク専用',
    stampDue: '法的効力なし',
    stampSubTop: 'PARODY ONLY',
    stampSubBottom: 'NO LEGAL EFFECT',
    docDisclaimer: '※ 本書はジョーク・エンターテインメント目的の仮想請求書であり、法的な効力は一切ありません。',
    footerDisclaimer:
      '免責事項：当サイトで作成されるすべての書類は娯楽目的のフィクションであり、法的効力や支払義務は一切生じません。他人の名義や実在の事業者情報を冒用して金銭を要求する行為は禁止されています。',
  },
  zh: {
    currency: '¥',
    docTitle: '请 求 单',
    docSub: 'PARODY STATEMENT OF ACCOUNT',
    docNoLabel: '单据编号',
    dateLabel: '开具日期',
    fromLabel: '请款人',
    toLabel: '付款人',
    fromPlaceholder: '姓名或昵称',
    toPlaceholder: '姓名或昵称',
    colDesc: '项目明细',
    colAmount: '金额',
    itemPlaceholder: '请输入请款项目内容',
    amountPlaceholder: '0',
    addItemBtn: '+ 添加项目',
    subtotal: '小计金额',
    fee: '附加手续费',
    total: '应付总额',
    clauseLabel: '附加条款及履行条件',
    clausePlaceholder: '例：今晚24:00前未结清可用一杯冰美式抵扣',
    themeLabel: '单据样式',
    themes: {
      receipt: '热敏小票',
      tax: '标准请款单',
      voucher: '记账凭证',
    },
    sendBtn: '生成请款单并复制链接',
    saveBtn: '保存为图片',
    counterBtn: '提出异议并发起反向请款',
    resetBtn: '新建请款单',
    adNotice: '正在生成请款单...',
    copiedToast: '请款单链接已复制到剪贴板。',
    stampIssued: '娱乐专用虚拟',
    stampDue: '仅供娱乐无效',
    stampSubTop: 'PARODY ONLY',
    stampSubBottom: 'NO LEGAL EFFECT',
    docDisclaimer: '※ 本单据仅为娱乐互动生成的虚拟内容，不具备任何法律效力。',
    footerDisclaimer:
      '免责声明：本网站生成的所有单据均为娱乐恶搞用途，不构成任何真实债权债务关系或法律效力。严禁冒用他人名义或真实商户信息索取钱财。',
  },
};

function encodePayload(data: InvoicePayload): string {
  const json = JSON.stringify(data);
  return encodeURIComponent(btoa(unescape(encodeURIComponent(json))));
}

function decodePayload(encoded: string): InvoicePayload | null {
  try {
    const json = decodeURIComponent(escape(atob(decodeURIComponent(encoded))));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getLocalDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function FakeStamp({
  text,
  subTop,
  subBottom,
  variant = 'square',
}: {
  text: string;
  subTop: string;
  subBottom: string;
  variant?: 'square' | 'circle';
}) {
  if (variant === 'circle') {
    return (
      <div className="w-16 h-16 rounded-full border-2 border-[#B91C1C]/80 text-[#B91C1C]/85 flex flex-col items-center justify-center rotate-[-12deg] select-none pointer-events-none shrink-0">
        <div className="w-14 h-14 rounded-full border border-[#B91C1C]/60 flex flex-col items-center justify-center px-1 text-center">
          <span className="text-[6px] tracking-tighter font-mono leading-none">{subTop}</span>
          <span className="text-[9px] font-black tracking-tight my-0.5 leading-tight break-keep">
            {text}
          </span>
          <span className="text-[6px] tracking-tighter font-mono leading-none">{subBottom}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="border-2 border-[#B91C1C]/85 text-[#B91C1C]/90 px-2 py-1 rotate-[5deg] select-none pointer-events-none inline-block shrink-0">
      <div className="border border-[#B91C1C]/50 px-1.5 py-0.5 text-center">
        <div className="text-[10px] font-black tracking-wider leading-tight">{text}</div>
        <div className="text-[7px] font-mono tracking-tighter opacity-80 leading-none mt-0.5">
          {subBottom}
        </div>
      </div>
    </div>
  );
}

export default function InvoiceApp() {
  const [lang, setLang] = useState<Lang>('ko');
  const [theme, setTheme] = useState<Theme>('tax');
  const [fromName, setFromName] = useState('');
  const [toName, setToName] = useState('');
  const [items, setItems] = useState<LineItem[]>([
    { id: '1', desc: '', amount: '' },
    { id: '2', desc: '', amount: '' },
  ]);
  const [feePercent, setFeePercent] = useState<number>(0);
  const [clause, setClause] = useState('');
  const [docNo, setDocNo] = useState('');
  const [issueDate, setIssueDate] = useState('');

  const [receivedData, setReceivedData] = useState<InvoicePayload | null>(null);
  const [isAdPlaying, setIsAdPlaying] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const receiptRef = useRef<HTMLDivElement>(null);

  const t = I18N[lang];

  useEffect(() => {
    const todayStr = getLocalDateString();
    setIssueDate(todayStr);

    const now = new Date();
    setDocNo(
      `INV-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}-${Math.floor(
        1000 + Math.random() * 9000
      )}`
    );

    const params = new URLSearchParams(window.location.search);
    const dataParam = params.get('d');
    if (dataParam) {
      const parsed = decodePayload(dataParam);
      if (parsed) {
        setReceivedData(parsed);
        setLang(parsed.lang || 'ko');
        setTheme(parsed.theme || 'tax');
        return;
      }
    }

    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('ja')) setLang('ja');
    else if (browserLang.startsWith('zh')) setLang('zh');
    else if (!browserLang.startsWith('ko')) setLang('en');
  }, []);

  const addLineItem = () => {
    setItems((prev) => [...prev, { id: String(Date.now()), desc: '', amount: '' }]);
  };

  const updateLineItem = (id: string, field: 'desc' | 'amount', value: string) => {
    if (field === 'amount') {
      const numeric = value.replace(/[^0-9]/g, '');
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, amount: numeric } : it)));
    } else {
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, desc: value } : it)));
    }
  };

  const removeLineItem = (id: string) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleFeeInput = (raw: string) => {
    const numeric = raw.replace(/[^0-9]/g, '');
    if (numeric === '') {
      setFeePercent(0);
      return;
    }
    const clamped = Math.min(300, Math.max(0, Number(numeric)));
    setFeePercent(clamped);
  };

  const validItems = items
    .filter((it) => it.desc.trim() !== '' || Number(it.amount) > 0)
    .map((it) => ({
      desc: it.desc.trim() || '-',
      amount: Number(it.amount) || 0,
    }));

  const subtotal = validItems.reduce((sum, it) => sum + it.amount, 0);
  const feeAmount = Math.round(subtotal * (feePercent / 100));
  const totalAmount = subtotal + feeAmount;

  const triggerInterstitialAd = (onComplete: () => void) => {
    setIsAdPlaying(true);
    // 광고 노출 및 로딩 연출 시간 (2.5초)
    setTimeout(() => {
      setIsAdPlaying(false);
      onComplete();
    }, 2500);
  };

  const handleSendInvoice = () => {
    const payload: InvoicePayload = {
      from: fromName.trim() || '-',
      to: toName.trim() || '-',
      items: validItems.length > 0 ? validItems : [{ desc: '-', amount: 0 }],
      feePercent,
      clause: clause.trim(),
      theme,
      lang,
      docNo,
      date: issueDate || getLocalDateString(),
    };

    triggerInterstitialAd(() => {
      const encoded = encodePayload(payload);
      const url = `${window.location.origin}${window.location.pathname}?d=${encoded}`;
      navigator.clipboard.writeText(url);
      setToastMsg(t.copiedToast);
      setTimeout(() => setToastMsg(''), 3500);
    });
  };

  const handleSaveImage = () => {
    triggerInterstitialAd(() => {
      alert(lang === 'ko' ? '청구서 이미지 저장이 완료되었습니다.' : 'Invoice image saved.');
    });
  };

  const handleCounterClaim = () => {
    if (!receivedData) return;
    setFromName(receivedData.to === '-' ? '' : receivedData.to);
    setToName(receivedData.from === '-' ? '' : receivedData.from);
    setItems([
      { id: String(Date.now()), desc: '', amount: '' },
      { id: String(Date.now() + 1), desc: '', amount: '' },
    ]);
    setFeePercent(0);
    setClause('');
    setIssueDate(getLocalDateString());
    setReceivedData(null);
    window.history.replaceState({}, '', window.location.pathname);
  };

  const view = receivedData
    ? {
        from: receivedData.from,
        to: receivedData.to,
        items: receivedData.items,
        feePercent: receivedData.feePercent,
        clause: receivedData.clause,
        theme: receivedData.theme,
        docNo: receivedData.docNo,
        date: receivedData.date,
        subtotal: receivedData.items.reduce((a, b) => a + b.amount, 0),
      }
    : {
        from: fromName.trim() || ' ',
        to: toName.trim() || ' ',
        items: validItems,
        feePercent,
        clause: clause.trim(),
        theme,
        docNo,
        date: issueDate || ' ',
        subtotal,
      };

  const viewFee = Math.round(view.subtotal * (view.feePercent / 100));
  const viewTotal = view.subtotal + viewFee;
  const stampLabel = receivedData ? t.stampDue : t.stampIssued;

  return (
    <div className="min-h-screen bg-[#E5E5E5] text-[#111111] pb-24 flex flex-col items-center font-sans">
      <header className="w-full max-w-lg flex justify-between items-center px-4 py-2.5 bg-[#1A1A1A] text-white sticky top-0 z-20">
        <span className="text-xs font-bold tracking-[0.2em] uppercase">INVOICE SYSTEM</span>
        <div className="flex gap-1 text-[11px]">
          {(['ko', 'en', 'ja', 'zh'] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-2 py-0.5 border ${
                lang === l
                  ? 'bg-white text-black border-white font-bold'
                  : 'border-zinc-600 text-zinc-400 hover:text-white'
              }`}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <main className="w-full max-w-lg px-4 pt-6 space-y-6 flex-1">
        <div ref={receiptRef} className="w-full">
          {/* [테마 1] 표준 청구서 양식 */}
          {view.theme === 'tax' && (
            <div className="bg-white border-2 border-[#111111] p-6 shadow-sm relative">
              <div className="flex justify-between items-start border-b-2 border-[#111111] pb-4 mb-4 gap-2">
                <div>
                  <p className="text-[10px] tracking-widest text-zinc-500 font-mono">
                    {t.docNoLabel}: {view.docNo}
                  </p>
                  <h1 className="text-2xl font-black tracking-[0.35em] mt-1">{t.docTitle}</h1>
                  <p className="text-[10px] tracking-widest text-zinc-500 mt-0.5">{t.docSub}</p>
                </div>
                <FakeStamp
                  text={stampLabel}
                  subTop={t.stampSubTop}
                  subBottom={t.stampSubBottom}
                  variant="square"
                />
              </div>

              <table className="w-full border-collapse border border-[#111111] text-xs mb-4">
                <tbody>
                  <tr>
                    <th className="border border-[#111111] bg-zinc-100 px-2.5 py-2 text-left w-24 font-bold">
                      {t.toLabel}
                    </th>
                    <td className="border border-[#111111] px-2.5 py-2 font-bold">{view.to}</td>
                    <th className="border border-[#111111] bg-zinc-100 px-2.5 py-2 text-left w-20 font-bold">
                      {t.dateLabel}
                    </th>
                    <td className="border border-[#111111] px-2.5 py-2 font-mono text-[11px] w-28 whitespace-nowrap">
                      {view.date}
                    </td>
                  </tr>
                  <tr>
                    <th className="border border-[#111111] bg-zinc-100 px-2.5 py-2 text-left font-bold">
                      {t.fromLabel}
                    </th>
                    <td colSpan={3} className="border border-[#111111] px-2.5 py-2 font-bold">
                      {view.from}
                    </td>
                  </tr>
                </tbody>
              </table>

              <table className="w-full border-collapse border border-[#111111] text-xs mb-4">
                <thead>
                  <tr className="bg-zinc-100">
                    <th className="border border-[#111111] px-2.5 py-2 text-left font-bold">
                      {t.colDesc}
                    </th>
                    <th className="border border-[#111111] px-2.5 py-2 text-right w-32 font-bold">
                      {t.colAmount} ({t.currency})
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {view.items.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="border border-[#111111] px-2.5 py-6 text-center text-zinc-400">
                        -
                      </td>
                    </tr>
                  ) : (
                    view.items.map((item, i) => (
                      <tr key={i}>
                        <td className="border border-[#111111] px-2.5 py-2 break-all">{item.desc}</td>
                        <td className="border border-[#111111] px-2.5 py-2 text-right font-mono">
                          {item.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <table className="w-full border-collapse border border-[#111111] text-xs mb-4">
                <tbody>
                  <tr>
                    <th className="border border-[#111111] bg-zinc-50 px-2.5 py-1.5 text-left font-normal">
                      {t.subtotal}
                    </th>
                    <td className="border border-[#111111] px-2.5 py-1.5 text-right font-mono w-36">
                      {t.currency}
                      {view.subtotal.toLocaleString()}
                    </td>
                  </tr>
                  <tr>
                    <th className="border border-[#111111] bg-zinc-50 px-2.5 py-1.5 text-left font-normal">
                      {t.fee} ({view.feePercent}%)
                    </th>
                    <td className="border border-[#111111] px-2.5 py-1.5 text-right font-mono">
                      {t.currency}
                      {viewFee.toLocaleString()}
                    </td>
                  </tr>
                  <tr className="bg-zinc-100 font-bold text-sm">
                    <th className="border border-[#111111] px-2.5 py-2.5 text-left">{t.total}</th>
                    <td className="border border-[#111111] px-2.5 py-2.5 text-right font-mono">
                      {t.currency}
                      {viewTotal.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>

              {view.clause && (
                <div className="border border-[#111111] p-3 text-xs mb-4">
                  <div className="text-[10px] font-bold text-zinc-500 mb-1">[{t.clauseLabel}]</div>
                  <p className="leading-relaxed break-keep">{view.clause}</p>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-zinc-300 flex justify-between items-center">
                <span className="text-[10px] text-zinc-400 font-mono">PARODY / VIRTUAL MEMO</span>
                <div className="flex items-center gap-2 relative">
                  <span className="text-xs font-bold">
                    {t.fromLabel}: {view.from}
                  </span>
                  <div className="-ml-1">
                    <FakeStamp
                      text={stampLabel}
                      subTop={t.stampSubTop}
                      subBottom={t.stampSubBottom}
                      variant="circle"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-dashed border-zinc-300 text-center">
                <p className="text-[10px] text-zinc-500 font-medium break-keep">{t.docDisclaimer}</p>
              </div>
            </div>
          )}

          {/* [테마 2] 열전사 감열지 영수증 양식 */}
          {view.theme === 'receipt' && (
            <div className="max-w-[340px] mx-auto bg-[#F9F9F7] text-[#18181B] px-6 py-7 font-mono shadow-sm border-x border-zinc-300 relative">
              <div
                className="absolute top-0 left-0 right-0 h-2 bg-[#E5E5E5]"
                style={{
                  clipPath:
                    'polygon(0% 0%, 100% 0%, 100% 100%, 95% 0%, 90% 100%, 85% 0%, 80% 100%, 75% 0%, 70% 100%, 65% 0%, 60% 100%, 55% 0%, 50% 100%, 45% 0%, 40% 100%, 35% 0%, 30% 100%, 25% 0%, 20% 100%, 15% 0%, 10% 100%, 5% 0%, 0% 100%)',
                }}
              />

              <div className="text-center border-b border-dashed border-zinc-400 pb-4 mb-4">
                <h1 className="text-lg font-bold tracking-[0.25em]">{t.docTitle}</h1>
                <p className="text-[10px] text-zinc-500 mt-1">{view.docNo}</p>
                <p className="text-[10px] text-zinc-500">{view.date}</p>
              </div>

              <div className="text-[11px] space-y-1 border-b border-dashed border-zinc-400 pb-3 mb-3">
                <div className="flex justify-between">
                  <span className="text-zinc-500">{t.fromLabel}</span>
                  <span className="font-bold">{view.from}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">{t.toLabel}</span>
                  <span className="font-bold">{view.to}</span>
                </div>
              </div>

              <div className="space-y-2 text-[11px] border-b border-dashed border-zinc-400 pb-3 mb-3 min-h-[60px]">
                {view.items.map((item, i) => (
                  <div key={i} className="flex justify-between gap-3">
                    <span className="break-all">{item.desc}</span>
                    <span className="whitespace-nowrap">
                      {t.currency}
                      {item.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-1 text-[11px] border-b border-dashed border-zinc-400 pb-3 mb-3">
                <div className="flex justify-between text-zinc-600">
                  <span>{t.subtotal}</span>
                  <span>
                    {t.currency}
                    {view.subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>
                    {t.fee} ({view.feePercent}%)
                  </span>
                  <span>
                    {t.currency}
                    {viewFee.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-base font-bold mb-4">
                <span>{t.total}</span>
                <span>
                  {t.currency}
                  {viewTotal.toLocaleString()}
                </span>
              </div>

              {view.clause && (
                <div className="border-t border-dashed border-zinc-400 pt-3 mb-4 text-[11px] leading-relaxed">
                  <span className="block text-[10px] text-zinc-500 mb-0.5">*{t.clauseLabel}</span>
                  {view.clause}
                </div>
              )}

              <div className="flex justify-end mb-3">
                <FakeStamp
                  text={stampLabel}
                  subTop={t.stampSubTop}
                  subBottom={t.stampSubBottom}
                  variant="square"
                />
              </div>

              <div className="pt-2 text-center">
                <div className="h-7 w-4/5 mx-auto bg-[repeating-linear-gradient(90deg,#18181B,#18181B_2px,transparent_2px,transparent_4px,#18181B_4px,#18181B_5px,transparent_5px,transparent_8px)]" />
                <p className="text-[9px] tracking-[0.3em] text-zinc-500 mt-1">{view.docNo}</p>
              </div>

              <p className="mt-2.5 pt-2 border-t border-dashed border-zinc-400 text-[9px] text-zinc-500 text-center font-sans leading-snug break-keep">
                {t.docDisclaimer}
              </p>

              <div
                className="absolute bottom-0 left-0 right-0 h-2 bg-[#E5E5E5]"
                style={{
                  clipPath:
                    'polygon(0% 100%, 100% 100%, 100% 0%, 95% 100%, 90% 0%, 85% 100%, 80% 0%, 75% 100%, 70% 0%, 65% 100%, 60% 0%, 55% 100%, 50% 0%, 45% 100%, 40% 0%, 35% 100%, 30% 0%, 25% 100%, 20% 0%, 15% 100%, 10% 0%, 5% 100%, 0% 0%)',
                }}
              />
            </div>
          )}

          {/* [테마 3] 지출/청구 전표 양식 */}
          {view.theme === 'voucher' && (
            <div className="bg-[#F4F6F8] border-2 border-[#1E3A8A] text-[#1E3A8A] p-6 font-serif relative">
              <div className="flex justify-between items-center border-b-2 border-double border-[#1E3A8A] pb-3 mb-4 gap-2">
                <div>
                  <h1 className="text-2xl font-bold tracking-[0.4em]">{t.docTitle}</h1>
                  <div className="flex gap-4 text-[11px] font-mono mt-1.5">
                    <span>NO. {view.docNo}</span>
                    <span>{view.date}</span>
                  </div>
                </div>
                <FakeStamp
                  text={stampLabel}
                  subTop={t.stampSubTop}
                  subBottom={t.stampSubBottom}
                  variant="circle"
                />
              </div>

              <div className="grid grid-cols-2 border border-[#1E3A8A] text-xs mb-4">
                <div className="p-2.5 border-r border-[#1E3A8A]">
                  <span className="block text-[10px] opacity-70">{t.toLabel}</span>
                  <span className="font-bold text-sm">{view.to}</span>
                </div>
                <div className="p-2.5">
                  <span className="block text-[10px] opacity-70">{t.fromLabel}</span>
                  <span className="font-bold text-sm">{view.from}</span>
                </div>
              </div>

              <div className="border border-[#1E3A8A] mb-4">
                <div className="grid grid-cols-3 bg-[#1E3A8A] text-white text-[11px] px-3 py-1.5 font-sans">
                  <span className="col-span-2">{t.colDesc}</span>
                  <span className="text-right">{t.colAmount}</span>
                </div>
                <div className="divide-y divide-[#1E3A8A]/30 text-xs">
                  {view.items.map((item, i) => (
                    <div key={i} className="grid grid-cols-3 px-3 py-2">
                      <span className="col-span-2 break-all">{item.desc}</span>
                      <span className="text-right font-mono">
                        {t.currency}
                        {item.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-[#1E3A8A] p-3 bg-white/70 space-y-1.5 text-xs mb-4">
                <div className="flex justify-between">
                  <span>{t.subtotal}</span>
                  <span className="font-mono">
                    {t.currency}
                    {view.subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>
                    {t.fee} ({view.feePercent}%)
                  </span>
                  <span className="font-mono">
                    {t.currency}
                    {viewFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2 border-t border-[#1E3A8A]">
                  <span>{t.total}</span>
                  <span className="font-mono">
                    {t.currency}
                    {viewTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {view.clause && (
                <div className="text-xs border-t border-[#1E3A8A] pt-2.5 mb-3">
                  <span className="font-bold mr-2">[{t.clauseLabel}]</span>
                  <span>{view.clause}</span>
                </div>
              )}

              <p className="mt-3 pt-2 border-t border-dashed border-[#1E3A8A]/40 text-[10px] text-[#1E3A8A]/70 text-center font-sans break-keep">
                {t.docDisclaimer}
              </p>
            </div>
          )}
        </div>

        {/* 수신 모드 하단 액션 (맞불 역청구) */}
        {receivedData ? (
          <div className="space-y-2.5 pt-2">
            <button
              onClick={handleCounterClaim}
              className="w-full py-3.5 bg-[#111111] hover:bg-black text-white font-bold text-xs tracking-wider uppercase border border-black transition"
            >
              {t.counterBtn}
            </button>
            <button
              onClick={() => {
                setReceivedData(null);
                window.history.replaceState({}, '', window.location.pathname);
              }}
              className="w-full py-3 bg-white hover:bg-zinc-100 text-black font-bold text-xs tracking-wider uppercase border border-zinc-400 transition"
            >
              {t.resetBtn}
            </button>
          </div>
        ) : (
          /* 작성 모드 입력 패널 */
          <div className="bg-white border border-zinc-300 p-5 space-y-5">
            <div>
              <label className="block text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-2">
                {t.themeLabel}
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {(['tax', 'receipt', 'voucher'] as Theme[]).map((th) => (
                  <button
                    key={th}
                    onClick={() => setTheme(th)}
                    className={`py-2 border font-bold transition ${
                      theme === th
                        ? 'bg-[#111111] text-white border-[#111111]'
                        : 'bg-zinc-50 text-zinc-700 border-zinc-300 hover:bg-zinc-100'
                    }`}
                  >
                    {t.themes[th]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-600 mb-1">{t.dateLabel}</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono border border-zinc-300 focus:outline-none focus:border-black bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-zinc-600 mb-1">{t.fromLabel}</label>
                <input
                  type="text"
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  placeholder={t.fromPlaceholder}
                  className="w-full px-3 py-2 text-xs border border-zinc-300 focus:outline-none focus:border-black"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-zinc-600 mb-1">{t.toLabel}</label>
                <input
                  type="text"
                  value={toName}
                  onChange={(e) => setToName(e.target.value)}
                  placeholder={t.toPlaceholder}
                  className="w-full px-3 py-2 text-xs border border-zinc-300 focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[11px] font-bold text-zinc-600">
                  {t.colDesc} / {t.colAmount} ({t.currency})
                </label>
              </div>
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-1.5 items-center">
                    <input
                      type="text"
                      value={item.desc}
                      onChange={(e) => updateLineItem(item.id, 'desc', e.target.value)}
                      placeholder={t.itemPlaceholder}
                      className="flex-1 px-2.5 py-2 text-xs border border-zinc-300 focus:outline-none focus:border-black"
                    />
                    <input
                      type="text"
                      inputMode="numeric"
                      value={item.amount ? Number(item.amount).toLocaleString() : ''}
                      onChange={(e) => updateLineItem(item.id, 'amount', e.target.value)}
                      placeholder={t.amountPlaceholder}
                      className="w-28 px-2.5 py-2 text-xs text-right font-mono border border-zinc-300 focus:outline-none focus:border-black"
                    />
                    {items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLineItem(item.id)}
                        className="px-2 py-2 text-xs text-zinc-400 hover:text-black border border-zinc-200"
                        aria-label="삭제"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addLineItem}
                className="mt-2 w-full py-2 border border-dashed border-zinc-400 text-xs font-bold text-zinc-700 hover:bg-zinc-50"
              >
                {t.addItemBtn}
              </button>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[11px] font-bold text-zinc-600">{t.fee} (0% ~ 300%)</label>
                <div className="flex items-center border border-zinc-300 bg-zinc-50 px-2 py-0.5">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={feePercent}
                    onChange={(e) => handleFeeInput(e.target.value)}
                    className="w-12 text-right text-xs font-mono font-bold bg-transparent focus:outline-none"
                  />
                  <span className="text-xs font-mono font-bold ml-0.5">%</span>
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={300}
                step={1}
                value={feePercent}
                onChange={(e) => setFeePercent(Number(e.target.value))}
                className="w-full accent-black cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                <span>0%</span>
                <span>100%</span>
                <span>200%</span>
                <span>300%</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-zinc-600 mb-1">{t.clauseLabel}</label>
              <input
                type="text"
                maxLength={80}
                value={clause}
                onChange={(e) => setClause(e.target.value)}
                placeholder={t.clausePlaceholder}
                className="w-full px-3 py-2 text-xs border border-zinc-300 focus:outline-none focus:border-black"
              />
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={handleSendInvoice}
                className="w-full py-3.5 bg-[#111111] hover:bg-black text-white font-bold text-xs tracking-wider uppercase transition"
              >
                {t.sendBtn}
              </button>
              <button
                onClick={handleSaveImage}
                className="w-full py-3 bg-white hover:bg-zinc-50 border border-[#111111] text-[#111111] font-bold text-xs tracking-wider uppercase transition"
              >
                {t.saveBtn}
              </button>
            </div>
          </div>
        )}

        {/* 웹사이트 하단 공식 면책 및 악용 금지 고지 */}
        <footer className="pt-2 pb-6 text-center px-2">
          <p className="text-[11px] text-zinc-500 leading-relaxed break-keep">
            {t.footerDisclaimer}
            <div className="mt-2">
              <a href="/privacy" className="underline text-[11px] text-zinc-600 hover:text-black">
                개인정보처리방침 / Privacy Policy
              </a>
            </div>
          </p>
        </footer>
      </main>

      {toastMsg && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#111111] text-white text-xs px-4 py-2.5 border border-zinc-700 shadow-lg z-50 whitespace-nowrap">
          {toastMsg}
        </div>
      )}

      {/* 팝업 발행/저장 시 나타나는 광고 연동 로딩 모달 */}
      {isAdPlaying && (
        <div className="fixed inset-0 bg-black/90 text-white flex flex-col items-center justify-center z-50 p-6 text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-xs tracking-wider mb-4">{t.adNotice}</p>

          {/* 구글 애드센스 광고 단위 삽입 영역 (승인 완료 시 자동으로 광고가 송출됨) */}
          <div className="w-full max-w-sm bg-white text-black p-4 rounded-xl shadow-lg">
            <div className="min-h-[180px] flex flex-col items-center justify-center border border-dashed border-zinc-300 rounded-lg p-2 bg-zinc-50 relative">
              <ins
                className="adsbygoogle"
                style={{ display: 'block', width: '100%', height: '100%' }}
                data-ad-client="ca-pub-7345794387970448"
                data-ad-slot="YOUR_AD_SLOT_ID"
                data-ad-format="auto"
                data-full-width-responsive="true"
              ></ins>
              <span className="text-[10px] text-zinc-400 mt-2">ADVERTISEMENT SPACE</span>
            </div>
          </div>
        </div>
      )}

      {/* 웹사이트 하단 고정 배너 광고 영역 */}
      <div className="fixed bottom-0 left-0 right-0 h-14 bg-zinc-200 border-t border-zinc-300 flex items-center justify-center z-30">
        <div className="w-[320px] h-[50px] bg-zinc-300 border border-zinc-400 flex items-center justify-center text-[10px] font-mono text-zinc-600">
          <ins
            className="adsbygoogle"
            style={{ display: 'inline-block', width: '320px', height: '50px' }}
            data-ad-client="ca-pub-7345794387970448"
            data-ad-slot="YOUR_BOTTOM_AD_SLOT_ID"
          ></ins>
          <span className="absolute text-[9px] text-zinc-500 pointer-events-none">ADVERTISEMENT (320x50)</span>
        </div>
      </div>
    </div>
  );
}