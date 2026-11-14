export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 py-10 px-4 font-sans">
      <div className="max-w-2xl mx-auto bg-white border border-zinc-300 p-6 space-y-6 text-xs leading-relaxed">
        <h1 className="text-lg font-bold border-b border-zinc-300 pb-3">
          개인정보처리방침 / Privacy Policy
        </h1>

        <section className="space-y-2">
          <h2 className="font-bold text-sm">1. 개인정보 수집 및 저장 없음 (No Server Data Storage)</h2>
          <p>
            본 서비스는 회원가입을 요구하지 않으며, 사용자가 입력하는 모든 텍스트(청구인, 피청구인, 항목, 금액 등)는
            별도의 서버 데이터베이스에 저장되지 않습니다. 입력된 데이터는 공유 URL 파라미터 내부에만 인코딩되어 처리됩니다.
          </p>
          <p className="text-zinc-600">
            This service does not require registration and does not store any user-entered text on a server database. All data is encoded strictly within the shared URL parameters.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-sm">2. 제3자 광고 및 쿠키 사용 안내 (Google AdSense & Cookies)</h2>
          <p>
            본 웹사이트는 수익 창출을 위해 Google AdSense 등 제3자 광고 네트워크를 사용합니다. Google을 포함한 제3자 공급업체는
            사용자의 이전 웹사이트 방문 기록을 기반으로 맞춤형 광고를 게재하기 위해 쿠키(Cookie)를 사용합니다.
          </p>
          <p className="text-zinc-600">
            We use third-party advertising companies (such as Google AdSense) to serve ads when you visit our website. Google uses cookies to serve ads based on a user&apos;s prior visits to your website or other websites. Users may opt out of personalized advertising by visiting Google Ads Settings.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-bold text-sm">3. 면책 조항 (Disclaimer)</h2>
          <p>
            본 사이트에서 생성되는 모든 문서는 오락 및 엔터테인먼트 목적의 가상 콘텐츠이며 어떠한 법적 효력도 갖지 않습니다.
          </p>
        </section>

        <div className="pt-4 border-t border-zinc-200">
          <a href="/" className="underline font-bold">
            ← 메인 화면으로 돌아가기 (Back to Home)
          </a>
        </div>
      </div>
    </div>
  );
}