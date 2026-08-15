import { useState } from 'react';
import { ArrowLeft, Shield } from 'lucide-react';
import { Header } from '@shared/components/Header';
import { Footer } from '@shared/components/Footer';

interface PrivacyPolicyPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export function PrivacyPolicyPage({ onBack, onNavigate }: PrivacyPolicyPageProps) {
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  const summaryEn = "VisvasaHome collects only the information necessary to provide our services. We do not sell your personal data. We use your information to connect you with verified professionals, manage bookings, and improve our platform. You have the right to access, correct, and delete your data. This policy complies with the GDPR (for EU visitors) and India's Digital Personal Data Protection Act 2023.";
  
  const summaryHi = "विश्वासाहोम केवल हमारी सेवाएं प्रदान करने के लिए आवश्यक जानकारी एकत्र करता है। हम आपका व्यक्तिगत डेटा नहीं बेचते हैं। हम आपकी जानकारी का उपयोग आपको सत्यापित पेशेवरों से जोड़ने, बुकिंग प्रबंधित करने और हमारे मंच को बेहतर बनाने के लिए करते हैं। आपके पास अपने डेटा को देखने, सुधारने और हटाने का अधिकार है। यह नीति जीडीपीआर (यूरोपीय संघ के आगंतुकों के लिए) और भारत के डिजिटल व्यक्तिगत डेटा संरक्षण (DPDP) अधिनियम 2023 का अनुपालन करती है।";

  const sectionsEn = [
    {
      title: '1. Who We Are',
      content: `This website is operated by Visvasahome Private Limited, a company incorporated in India under the Companies Act, 2013. We operate a B2C technology platform — VisvasaHome — that connects customers with verified local service professionals for home maintenance, repairs, Annual Maintenance Contracts (AMC), and construction services.\n\nRegistered Office: Visvasahome Private Limited, Jaipur, Rajasthan, India — 302001\nWebsite: www.visvasahome.com\nEmail: contact@visvasahome.com\nPhone: +91 905 7567 160`,
    },
    {
      title: '2. Information We Collect',
      content: `When you use VisvasaHome, we may collect the following types of information:

• Personal Information: Your name, phone number, and email address when you make a booking, register an account, or contact us.
• Service Information: The type of service required, your location (city/area), preferred scheduling, and service history.
• Professional Information (for contractors): Identification documents, certifications, bank account details, and work history.
• Usage Data: How you interact with our website, including pages visited and time spent (collected via standard analytics tools).
• Communication Records: WhatsApp messages, call records, and contact form submissions for support and quality assurance purposes.

We do not collect payment card data. Payments are processed through secure third-party payment gateways.`,
    },
    {
      title: '3. How We Use Your Information',
      content: `We use the information we collect to:

• Process and manage your service bookings
• Match you with the most suitable verified professional in your area
• Confirm appointments and send service reminders
• Handle customer support requests and complaints
• Verify the identity and credentials of service professionals
• Process payments and maintain billing records
• Improve our platform, services, and matching algorithms
• Send relevant service updates (you can opt out at any time)
• Comply with applicable Indian laws and regulatory requirements

We do not use your data for unsolicited marketing, sell it to third parties, or share it with advertisers.`,
    },
    {
      title: '4. How We Share Your Information',
      content: `We share information only as necessary to provide services:

• With Service Professionals: We share your name, contact number, and service address with the professional assigned to your booking so they can contact you and complete the job.
• With Payment Processors: Payment information is securely handled by our third-party payment partners (e.g., Razorpay). We do not store card details. These processors are GDPR and PCI-DSS compliant.
• With Analytics Tools: We use privacy-compliant analytics (Google Analytics with IP anonymization) to understand website usage patterns. This data is anonymized and aggregated.
• Cloud Service Providers: We use secure cloud infrastructure (Supabase, Firebase) that complies with international data protection standards including GDPR.
• Legal Requirements: We may disclose information if required by Indian law, court order, regulatory authority, or to protect our legal rights.

International Data Transfers: Your data may be processed on servers located outside India. We ensure adequate safeguards are in place through standard contractual clauses and service provider certifications (ISO 27001, SOC 2).

We never sell, rent, or trade your personal information to any third party for commercial purposes.`,
    },
    {
      title: '5. Data Retention',
      content: `We retain your personal data for as long as your account is active or as needed to provide services. Booking records are retained for 7 years as required by Indian accounting and tax regulations. You may request deletion of your account and associated data at any time by contacting contact@visvasahome.com, subject to legal retention requirements.`,
    },
    {
      title: '6. Your Rights (GDPR & DPDP Act 2023)',
      content: `As a user of VisvasaHome, you have the following data protection rights:

• Right to Access: Request a copy of the personal data we hold about you
• Right to Rectification: Request correction of inaccurate or incomplete information
• Right to Erasure ("Right to be Forgotten"): Request deletion of your account and personal data (subject to legal retention requirements)
• Right to Data Portability: Receive your data in a structured, machine-readable format
• Right to Withdraw Consent: Withdraw your consent for data processing at any time (where consent is the legal basis)
• Right to Opt-Out: Unsubscribe from marketing communications at any time
• Right to Object: Object to processing of your personal data for specific purposes
• Right to Restrict Processing: Request limitation on how we use your data in certain circumstances

For EU visitors under GDPR: You also have the right to lodge a complaint with your local data protection authority.

For Indian users under DPDP Act 2023: You have the right to nominate another individual to exercise these rights on your behalf in case of death or incapacity.

To exercise any of these rights, email us at contact@visvasahome.com with your name, phone number, and specific request. We will respond within 30 days (GDPR) or as required under Indian law. Identity verification may be required to process certain requests.`,
    },
    {
      title: '7. Security',
      content: `We take appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include HTTPS encryption for all data transmission, restricted access to personal data within our team, secure storage systems, and regular security reviews. No system is 100% secure; if you suspect a security issue, please contact us immediately.`,
    },
    {
      title: '8. Cookies and Tracking (GDPR & DPDP Act 2023 Compliant)',
      content: `Our website uses cookies to enhance your experience and analyze platform performance. We categorize cookies as follows:

• Essential Cookies: Required for core website functionality (session management, login state, security). These cannot be disabled as they are necessary for the platform to work.
• Analytics Cookies: Used to understand how visitors use our website (Google Analytics). These help us improve user experience and are only activated with your consent.
• Marketing Cookies: Currently not used on our platform.

You have full control over non-essential cookies through our cookie consent banner. You can change your preferences at any time by clearing your browser cookies or accessing the cookie settings link in the footer. For EU visitors, we comply with GDPR by obtaining explicit consent before placing analytics cookies. For Indian users, we follow the Digital Personal Data Protection (DPDP) Act 2023 requirements.

Disabling essential cookies may affect website functionality. Analytics cookies do not personally identify you and are only used in aggregate form.`,
    },
    {
      title: '9. Children\'s Privacy',
      content: `VisvasaHome services are not directed at children under 18 years of age. We do not knowingly collect personal information from minors. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.`,
    },
    {
      title: '10. Changes to This Policy',
      content: `We may update this Privacy Policy from time to time to reflect changes in our practices or applicable laws. Significant changes will be notified via email or a prominent notice on our website. Continued use of VisvasaHome after policy changes constitutes acceptance of the updated terms.`,
    },
    {
      title: '11. Contact Us',
      content: `For any privacy-related questions, data requests, or concerns, please contact us at:\n\nLegal Entity: Visvasahome Private Limited\nEmail: contact@visvasahome.com\nPhone: +91 905 7567 160\nWhatsApp: +91 905 7567 160\nRegistered Office: Jaipur, Rajasthan, India — 302001\nWebsite: www.visvasahome.com\n\nWe will respond to all privacy requests within 30 days.`,
    },
  ];

  const sectionsHi = [
    {
      title: '1. हम कौन हैं',
      content: `यह वेबसाइट विश्वासाहोम प्राइवेट लिमिटेड (Visvasahome Private Limited) द्वारा संचालित की जाती है, जो कंपनी अधिनियम, 2013 के तहत भारत में पंजीकृत कंपनी है। हम एक बी2सी (B2C) प्रौद्योगिकी मंच संचालित करते हैं जो ग्राहकों को गृह मरम्मत, वार्षिक रखरखाव अनुबंध (AMC) और निर्माण सेवाओं के लिए सत्यापित स्थानीय सेवा पेशेवरों से जोड़ता है।\n\nपंजीकृत कार्यालय: विश्वासाहोम प्राइवेट लिमिटेड, जयपुर, राजस्थान, भारत — 302001\nवेबसाइट: www.visvasahome.com\nईमेल: contact@visvasahome.com\nफोन: +91 905 7567 160`,
    },
    {
      title: '2. जानकारी जो हम एकत्र करते हैं',
      content: `जब आप विश्वासाहोम का उपयोग करते हैं, तो हम निम्नलिखित प्रकार की जानकारी एकत्र कर सकते हैं:

• व्यक्तिगत जानकारी: जब आप बुकिंग करते हैं, खाता पंजीकृत करते हैं, या हमसे संपर्क करते हैं, तो आपका नाम, फोन नंबर और ईमेल पता।
• सेवा संबंधी जानकारी: आवश्यक सेवा का प्रकार, आपका स्थान (शहर/क्षेत्र), पसंदीदा समय और सेवा का इतिहास।
• व्यावसायिक जानकारी (पेशेवरों के लिए): पहचान दस्तावेज, प्रमाण पत्र, बैंक खाता विवरण और कार्य इतिहास।
• उपयोग डेटा: आप हमारी वेबसाइट के साथ कैसे इंटरैक्ट करते हैं, जिसमें देखे गए पृष्ठ और बिताया गया समय शामिल है (मानक विश्लेषण उपकरणों के माध्यम से एकत्र)।
• संचार रिकॉर्ड: सहायता और गुणवत्ता आश्वासन के उद्देश्यों के लिए व्हाट्सएप संदेश, कॉल रिकॉर्ड और संपर्क फ़ॉर्म सबमिशन।

हम भुगतान कार्ड डेटा एकत्र नहीं करते हैं। भुगतान सुरक्षित तृतीय-पक्ष भुगतान गेटवे के माध्यम से संसाधित किए जाते हैं।`,
    },
    {
      title: '3. हम आपकी जानकारी का उपयोग कैसे करते हैं',
      content: `हम एकत्रित जानकारी का उपयोग निम्नलिखित उद्देश्यों के लिए करते हैं:

• आपकी सेवा बुकिंग को संसाधित और प्रबंधित करने के लिए
• आपको आपके क्षेत्र के सबसे उपयुक्त सत्यापित पेशेवर से मिलाने के लिए
• नियुक्तियों की पुष्टि करने और सेवा अनुस्मारक भेजने के लिए
• ग्राहक सहायता अनुरोधों और शिकायतों का समाधान करने के लिए
• सेवा पेशेवरों की पहचान और क्रेडेंशियल सत्यापित करने के लिए
• भुगतान संसाधित करने और बिलिंग रिकॉर्ड बनाए रखने के लिए
• हमारे मंच, सेवाओं और मिलान एल्गोरिदम को बेहतर बनाने के लिए
• प्रासंगिक सेवा अपडेट भेजने के लिए (आप किसी भी समय ऑप्ट-आउट कर सकते हैं)
• लागू भारतीय कानूनों और नियामक आवश्यकताओं का पालन करने के लिए

हम अवांछित विपणन के लिए आपके डेटा का उपयोग नहीं करते हैं, इसे तीसरे पक्षों को नहीं बेचते हैं, या विज्ञापनदाताओं के साथ साझा नहीं करते हैं।`,
    },
    {
      title: '4. हम आपकी जानकारी कैसे साझा करते हैं',
      content: `हम सेवाएं प्रदान करने के लिए केवल आवश्यकतानुसार जानकारी साझा करते हैं:

• सेवा पेशेवरों के साथ: हम आपकी बुकिंग से जुड़े पेशेवर के साथ आपका नाम, संपर्क नंबर और सेवा का पता साझा करते हैं ताकि वे आपसे संपर्क कर सकें और काम पूरा कर सकें।
• भुगतान प्रोसेसर के साथ: भुगतान जानकारी हमारे तृतीय-पक्ष भुगतान भागीदारों (जैसे, रेज़रपे) द्वारा सुरक्षित रूप से संभाली जाती है। हम कार्ड विवरण संग्रहीत नहीं करते हैं।
• विश्लेषणात्मक उपकरणों के साथ: हम वेबसाइट के उपयोग के पैटर्न को समझने के लिए गोपनीयता-अनुरूप विश्लेषण (जैसे आईपी अज्ञातिकरण के साथ Google Analytics) का उपयोग करते हैं।
• क्लाउड सेवा प्रदाताओं के साथ: हम सुरक्षित क्लाउड इन्फ्रास्ट्रक्चर (सुपाबेस, फायरबेस) का उपयोग करते हैं।
• कानूनी आवश्यकताएं: यदि भारतीय कानून, अदालती आदेश, या नियामक प्राधिकरण द्वारा आवश्यक हो, तो हम जानकारी का खुलासा कर सकते हैं।

हम व्यावसायिक उद्देश्यों के लिए किसी भी तीसरे पक्ष को आपकी व्यक्तिगत जानकारी कभी नहीं बेचते, किराए पर या व्यापार नहीं करते हैं।`,
    },
    {
      title: '5. डेटा प्रतिधारण',
      content: `हम आपके व्यक्तिगत डेटा को तब तक सुरक्षित रखते हैं जब तक आपका खाता सक्रिय है या सेवाएं प्रदान करने के लिए आवश्यक है। भारतीय लेखा और कर नियमों के अनुसार बुकिंग रिकॉर्ड को 7 वर्षों तक सुरक्षित रखा जाता है। आप contact@visvasahome.com पर संपर्क करके किसी भी समय अपना खाता और संबंधित डेटा हटाने का अनुरोध कर सकते हैं।`,
    },
    {
      title: '6. आपके अधिकार (GDPR और DPDP अधिनियम 2023)',
      content: `विश्वासाहोम के उपयोगकर्ता के रूप में, आपके पास निम्नलिखित डेटा सुरक्षा अधिकार हैं:

• पहुंच का अधिकार: हमारे पास आपके बारे में मौजूद व्यक्तिगत डेटा की एक प्रति का अनुरोध करें।
• सुधार का अधिकार: गलत या अधूरी जानकारी को सही करने का अनुरोध करें।
• मिटाने का अधिकार (\"भूल जाने का अधिकार\"): अपना खाता और व्यक्तिगत डेटा हटाने का अनुरोध करें (कानूनी प्रतिधारण आवश्यकताओं के अधीन)।
• डेटा पोर्टेबिलिटी का अधिकार: अपना डेटा एक संरचित, मशीन-पठनीय प्रारूप में प्राप्त करें।
• सहमति वापस लेने का अधिकार: किसी भी समय डेटा प्रसंस्करण के लिए अपनी सहमति वापस लें।
• ऑप्ट-आउट का अधिकार: किसी भी समय विपणन संचार से सदस्यता समाप्त करें।

भारतीय उपयोगकर्ताओं के लिए (DPDP अधिनियम 2023): मृत्यु या अक्षमता के मामले में आपको अपनी ओर से इन अधिकारों का प्रयोग करने के लिए किसी अन्य व्यक्ति को नामांकित करने का अधिकार है।

इनमें से किसी भी अधिकार का प्रयोग करने के लिए, अपने नाम, फोन नंबर और विशिष्ट अनुरोध के साथ हमें contact@visvasahome.com पर ईमेल करें। हम 30 दिनों के भीतर जवाब देंगे।`,
    },
    {
      title: '7. सुरक्षा',
      content: `हम अनधिकृत पहुंच, परिवर्तन, प्रकटीकरण या विनाश के खिलाफ आपकी व्यक्तिगत जानकारी की रक्षा के लिए उचित तकनीकी और संगठनात्मक उपाय करते हैं। इन उपायों में सभी डेटा ट्रांसमिशन के लिए HTTPS एन्क्रिप्शन, हमारी टीम के भीतर व्यक्तिगत डेटा तक सीमित पहुंच, सुरक्षित भंडारण प्रणाली और नियमित सुरक्षा समीक्षा शामिल हैं।`,
    },
    {
      title: '8. कुकीज़ और ट्रैकिंग (GDPR और DPDP अधिनियम 2023 अनुपालन)',
      content: `हमारी वेबसाइट आपके अनुभव को बेहतर बनाने और प्रदर्शन का विश्लेषण करने के लिए कुकीज़ का उपयोग करती है। हम कुकीज़ को निम्नानुसार वर्गीकृत करते हैं:

• आवश्यक कुकीज़: मूल वेबसाइट कार्यक्षमता के लिए आवश्यक (सत्र प्रबंधन, लॉगिन स्थिति, सुरक्षा)। इन्हें अक्षम नहीं किया जा सकता।
• विश्लेषण कुकीज़: यह समझने के लिए उपयोग किया जाता है कि आगंतुक हमारी वेबसाइट का उपयोग कैसे करते हैं (Google Analytics)। ये केवल आपकी सहमति से सक्रिय होती हैं।

आपके पास हमारे कुकी सहमति बैनर के माध्यम से गैर-आवश्यक कुकीज़ पर पूर्ण नियंत्रण है।`,
    },
    {
      title: '9. बच्चों की गोपनीयता',
      content: `विश्वासाहोम सेवाएं 18 वर्ष से कम उम्र के बच्चों के लिए निर्देशित नहीं हैं। हम जानबूझकर नाबालिगों से व्यक्तिगत जानकारी एकत्र नहीं करते हैं। यदि आपको लगता है कि किसी बच्चे ने हमें व्यक्तिगत जानकारी प्रदान की है, तो कृपया हमसे संपर्क करें और हम इसे तुरंत हटा देंगे।`,
    },
    {
      title: '10. इस नीति में परिवर्तन',
      content: `हम अपनी प्रथाओं या लागू कानूनों में बदलाव को दर्शाने के लिए समय-समय पर इस गोपनीयता नीति को अपडेट कर सकते हैं। महत्वपूर्ण परिवर्तनों की सूचना ईमेल या हमारी वेबसाइट पर एक प्रमुख सूचना के माध्यम से दी जाएगी।`,
    },
    {
      title: '11. हमसे संपर्क करें',
      content: `किसी भी गोपनीयता-संबंधी प्रश्न, डेटा अनुरोध या चिंताओं के लिए, कृपया हमसे यहां संपर्क करें:\n\nकानूनी इकाई: विश्वासाहोम प्राइवेट लिमिटेड\nईमेल: contact@visvasahome.com\nफोन: +91 905 7567 160\nव्हाट्सएप: +91 905 7567 160\nपंजीकृत कार्यालय: जयपुर, राजस्थान, भारत — 302001\nवेबसाइट: www.visvasahome.com`,
    },
  ];

  const sections = lang === 'en' ? sectionsEn : sectionsHi;
  const summary = lang === 'en' ? summaryEn : summaryHi;

  return (
    <div className="min-h-screen bg-white">
      <Header
        onRegisterContractor={() => onNavigate('register-contractor')}
        onBookService={() => onNavigate('get-started-customer')}
        selectedLocation={null}
        onLocationSelect={() => {}}
        onAMCOffice={() => onNavigate('amc-office')}
        onAMCHome={() => onNavigate('amc-home')}
        onAMCCommercial={() => onNavigate('amc-commercial')}
        onAMCIndustrial={() => onNavigate('amc-industrial')}
        onAMCHealthcare={() => onNavigate('amc-healthcare')}
        onAMCEducational={() => onNavigate('amc-educational')}
        onAMCHospitality={() => onNavigate('amc-hospitality')}
        onAMCSociety={() => onNavigate('amc-society')}
        onHome={onBack}
      />

      {/* Legal Operator Notice */}
      <div className="bg-gray-950 text-gray-300 py-3">
        <div className="max-w-4xl mx-auto px-4 text-center text-xs">
          {lang === 'en' ? (
            <>This website is operated by <strong className="text-white">Visvasahome Private Limited</strong> — Registered in India | Jaipur, Rajasthan — 302001</>
          ) : (
            <>यह वेबसाइट <strong className="text-white">विश्वासाहोम प्राइवेट लिमिटेड</strong> द्वारा संचालित है — भारत में पंजीकृत | जयपुर, राजस्थान — 302001</>
          )}
        </div>
      </div>

      <section className="bg-gradient-to-br from-[#2563EB] via-[#1D4ED8] to-[#1E40AF] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            {lang === 'en' ? 'Back' : 'पीछे'}
          </button>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-semibold text-white">
              {lang === 'en' ? 'Privacy Policy' : 'गोपनीयता नीति'}
            </h1>
          </div>
          <p className="text-blue-100">
            {lang === 'en' 
              ? 'Last updated: June 10, 2026 | DPDP Act 2023 Compliant | Effective for all users of www.visvasahome.com' 
              : 'अंतिम अपडेट: 10 जून, 2026 | DPDP अधिनियम 2023 अनुपालन | www.visvasahome.com के सभी उपयोगकर्ताओं के लिए प्रभावी'}
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Language Switcher */}
          <div className="flex justify-end gap-2 mb-8 border-b border-gray-100 pb-4">
            <button
              onClick={() => setLang('en')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                lang === 'en'
                  ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/10'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang('hi')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                lang === 'hi'
                  ? 'bg-[#2563EB] text-white shadow-md shadow-blue-500/10'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              हिन्दी (Hindi)
            </button>
          </div>

          <div className="prose prose-gray max-w-none">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-10">
              <p className="text-blue-800 text-sm leading-relaxed">
                <strong>{lang === 'en' ? 'Summary:' : 'सारांश:'}</strong> {summary}
              </p>
            </div>

            {sections.map((section, idx) => (
              <div key={idx} className="mb-10 border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">{section.title}</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer onNavigate={(page: any) => onNavigate(page)} />
    </div>
  );
}
