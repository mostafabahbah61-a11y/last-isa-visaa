import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "ar";

type Dict = Record<string, { en: string; ar: string }>;

export const dict: Dict = {
  "brand.name": { en: "GlobeVisa Online", ar: "جلوب فيزا أونلاين" },
  "brand.tagline": { en: "Visa & Travel Services", ar: "خدمات التأشيرات والسفر" },

  "nav.menu": { en: "Menu", ar: "القائمة" },
  "nav.close": { en: "Close", ar: "إغلاق" },
  "nav.home": { en: "Home", ar: "الرئيسية" },
  "nav.domestic": { en: "Domestic Tourism", ar: "السياحة الداخلية" },
  "nav.international": { en: "International Tourism", ar: "السياحة الخارجية" },
  "nav.flights": { en: "Flight Booking", ar: "حجز الطيران" },
  "nav.why": { en: "Why Online?", ar: "لماذا أونلاين؟" },
  "nav.info": { en: "Info / About", ar: "إنفو / معلومات" },
  "nav.contact": { en: "Contact Us", ar: "تواصل معنا" },
  "nav.language": { en: "العربية", ar: "English" },

  "hero.eyebrow": { en: "Egyptian expertise · Global reach", ar: "خبرة مصرية · وصول عالمي" },
  "hero.title": { en: "Travel begins with the right paperwork", ar: "رحلتك تبدأ من الأوراق الصحيحة" },
  "hero.subtitle": {
    en: "GlobeVisa Online handles visas, domestic and international trips, and flight bookings for travellers across Egypt — entirely online, step by step, with a real person following your file.",
    ar: "جلوب فيزا أونلاين تتولى التأشيرات والرحلات الداخلية والخارجية وحجز الطيران للمسافرين في مصر — أونلاين بالكامل، خطوة بخطوة، مع متابعة شخصية لملفك.",
  },
  "hero.cta1": { en: "Start your request", ar: "ابدأ طلبك" },
  "hero.cta2": { en: "Explore destinations", ar: "استكشف الوجهات" },
  "hero.scroll": { en: "Scroll to explore", ar: "مرّر للاستكشاف" },

  "home.services": { en: "Our services", ar: "خدماتنا" },
  "home.servicesSub": {
    en: "Six clear paths. Choose the one that matches your trip.",
    ar: "ستة مسارات واضحة. اختر ما يناسب رحلتك.",
  },
  "home.domesticDesc": {
    en: "Red Sea escapes and Nile heritage, arranged end to end.",
    ar: "رحلات البحر الأحمر وتراث النيل، منظمة من البداية للنهاية.",
  },
  "home.internationalDesc": {
    en: "Visa guidance and travel plans for tourism or business.",
    ar: "إرشاد التأشيرات وخطط السفر للسياحة أو البيزنس.",
  },
  "home.flightsDesc": {
    en: "From where to where — we find and issue the ticket.",
    ar: "من فين لفين — نبحث ونصدر التذكرة.",
  },
  "home.whyDesc": {
    en: "How the online process works and why it is easier for you.",
    ar: "كيف تتم العملية أونلاين ولماذا هي أسهل لك.",
  },
  "home.infoDesc": { en: "Who we are and how we work.", ar: "من نحن وكيف نعمل." },
  "home.contactDesc": { en: "Phone and WhatsApp, direct.", ar: "هاتف وواتساب، مباشرة." },
  "home.open": { en: "Open", ar: "افتح" },

  "dom.title": { en: "Domestic Tourism", ar: "السياحة الداخلية" },
  "dom.question": { en: "Where would you like to go?", ar: "عايز تروح فين؟" },
  "dom.intro": {
    en: "Tell us your destination inside Egypt and the dates you have in mind. We put together the stay, transfers and programme, and send you the details to confirm.",
    ar: "قل لنا وجهتك داخل مصر والتواريخ التي تفكر بها. نجهّز الإقامة والانتقالات والبرنامج ونرسل لك التفاصيل للتأكيد.",
  },
  "dom.pick": { en: "Choose a destination", ar: "اختر وجهة" },
  "dom.other": { en: "Another destination in Egypt", ar: "وجهة أخرى داخل مصر" },
  "dom.explore": { en: "Explore destination", ar: "استكشف الوجهة" },
  "dest.sharm": { en: "Sharm El-Sheikh", ar: "شرم الشيخ" },
  "dest.sharm.d": { en: "Diving, reefs and resort bays on the Red Sea.", ar: "غوص وشعاب ومنتجعات على البحر الأحمر." },
  "dest.hurghada": { en: "Hurghada", ar: "الغردقة" },
  "dest.hurghada.d": { en: "Beach resorts, water sports and island trips.", ar: "منتجعات شاطئية ورياضات مائية ورحلات الجزر." },
  "dest.luxor": { en: "Luxor", ar: "الأقصر" },
  "dest.luxor.d": { en: "Temples, the Nile and the Valley of the Kings.", ar: "المعابد والنيل ووادي الملوك." },
  "dest.aswan": { en: "Aswan", ar: "أسوان" },
  "dest.aswan.d": { en: "Felucca sails, Nubian culture and calm river days.", ar: "الفلوكة والثقافة النوبية وأيام هادئة على النيل." },
  "dest.dubai": { en: "Dubai", ar: "دبي" },
  "dest.dubai.d": { en: "United Arab Emirates", ar: "الإمارات العربية المتحدة" },
  "dest.istanbul": { en: "Istanbul", ar: "إسطنبول" },
  "dest.istanbul.d": { en: "Türkiye", ar: "تركيا" },
  "dest.paris": { en: "Paris", ar: "باريس" },
  "dest.paris.d": { en: "France · Schengen", ar: "فرنسا · شنغن" },
  "dest.london": { en: "London", ar: "لندن" },
  "dest.london.d": { en: "United Kingdom", ar: "المملكة المتحدة" },

  "intl.title": { en: "International Tourism", ar: "السياحة الخارجية" },
  "intl.question": { en: "Which country do you want to travel to?", ar: "عايز تسافر أنهي بلد؟" },
  "intl.intro": {
    en: "Pick the country, then tell us the purpose of the trip. The requirements, documents and timeline differ between tourism and business, so we start from there.",
    ar: "اختر الدولة ثم أخبرنا بغرض السفر. المتطلبات والمستندات والمدة تختلف بين السياحة والبيزنس، لذلك نبدأ من هنا.",
  },
  "intl.purpose": { en: "Type of travel", ar: "نوع السفر" },
  "intl.tourism": { en: "Tourism", ar: "سياحة" },
  "intl.tourismD": {
    en: "Holidays, family visits and personal trips.",
    ar: "الإجازات وزيارات العائلة والرحلات الشخصية.",
  },
  "intl.business": { en: "Business", ar: "بيزنس" },
  "intl.businessD": {
    en: "Meetings, exhibitions, conferences and company travel.",
    ar: "الاجتماعات والمعارض والمؤتمرات وسفر الشركات.",
  },
  "intl.selected": { en: "Your selection", ar: "اختيارك" },
  "intl.country": { en: "Country", ar: "الدولة" },
  "intl.otherCountry": { en: "Another country", ar: "دولة أخرى" },
  "intl.send": { en: "Continue with this request", ar: "تابع بهذا الطلب" },
  "intl.ready": {
    en: "Your selection is ready. Send it to us from the contact page.",
    ar: "اختيارك جاهز. أرسله لنا من صفحة التواصل.",
  },
  "intl.pickBoth": { en: "Choose a country and a travel type.", ar: "اختر الدولة ونوع السفر." },

  "fl.title": { en: "Flight Booking", ar: "حجز الطيران" },
  "fl.from": { en: "Where are you departing from?", ar: "هتتحرك منين؟" },
  "fl.to": { en: "Where are you traveling to?", ar: "هتحجز لحد فين؟" },
  "fl.fromPh": { en: "City or airport", ar: "المدينة أو المطار" },
  "fl.toPh": { en: "City or airport", ar: "المدينة أو المطار" },
  "fl.date": { en: "Departure date", ar: "تاريخ المغادرة" },
  "fl.return": { en: "Return date (optional)", ar: "تاريخ العودة (اختياري)" },
  "fl.pax": { en: "Passengers", ar: "عدد المسافرين" },
  "fl.submit": { en: "Request this flight", ar: "اطلب هذه الرحلة" },
  "fl.intro": {
    en: "Give us the route and the dates. We compare the available options and come back with fares and timings before anything is issued.",
    ar: "أعطنا خط السير والتواريخ. نقارن الخيارات المتاحة ونعود إليك بالأسعار والمواعيد قبل إصدار أي شيء.",
  },
  "fl.sent": {
    en: "Route saved. Send these details to us from the contact page and we will come back with options.",
    ar: "تم حفظ خط السير. أرسل هذه التفاصيل من صفحة التواصل وسنعود إليك بالخيارات.",
  },
  "fl.summary": { en: "Your route", ar: "خط سيرك" },
  "common.goContact": { en: "Go to contact", ar: "اذهب للتواصل" },

  "why.title": { en: "Why do we do this online?", ar: "ليه الموضوع ده بيتم أونلاين؟" },
  "why.lead": {
    en: "Visa files and travel bookings are mostly paperwork, follow-up and timing. None of that needs you to sit in an office. Working online lets us keep your file moving while you carry on with your day.",
    ar: "ملفات التأشيرات وحجوزات السفر في معظمها أوراق ومتابعة وتوقيت، ولا شيء من ذلك يتطلب جلوسك في مكتب. العمل أونلاين يجعل ملفك يتقدم بينما تكمل يومك.",
  },
  "why.p1.t": { en: "No travel to an office", ar: "بدون التنقل إلى مكتب" },
  "why.p1.d": {
    en: "You send documents from wherever you are, at any hour. There is no queue, no appointment for a first conversation and no lost day of work.",
    ar: "ترسل مستنداتك من أي مكان وفي أي وقت. لا طوابير ولا موعد مسبق لأول محادثة ولا يوم عمل ضائع.",
  },
  "why.p2.t": { en: "Everything is written down", ar: "كل شيء موثّق كتابةً" },
  "why.p2.d": {
    en: "Requirements, prices and deadlines are sent in writing, so you can re-read them later instead of relying on what was said over a counter.",
    ar: "المتطلبات والأسعار والمواعيد ترسل مكتوبة، فتستطيع مراجعتها لاحقاً بدلاً من الاعتماد على كلام شفهي.",
  },
  "why.p3.t": { en: "Documents checked before submission", ar: "مراجعة المستندات قبل التقديم" },
  "why.p3.d": {
    en: "You share scans first. We review them and tell you what is missing or unclear before anything is submitted — the main reason files get delayed.",
    ar: "ترسل النسخ الممسوحة أولاً، نراجعها ونخبرك بما هو ناقص أو غير واضح قبل التقديم — وهو السبب الرئيسي لتأخر الملفات.",
  },
  "why.p4.t": { en: "One thread, one history", ar: "محادثة واحدة بسجل كامل" },
  "why.p4.d": {
    en: "Your whole request lives in a single conversation: the documents, the answers and every update stay in one place for both sides.",
    ar: "طلبك بالكامل في محادثة واحدة: المستندات والردود وكل تحديث في مكان واحد للطرفين.",
  },
  "why.p5.t": { en: "Faster back-and-forth", ar: "تواصل أسرع" },
  "why.p5.d": {
    en: "A missing signature or a new appointment date is handled in minutes over a message instead of another visit.",
    ar: "توقيع ناقص أو موعد جديد يُحل في دقائق برسالة بدلاً من زيارة أخرى.",
  },
  "why.p6.t": { en: "Same service, wherever you live", ar: "نفس الخدمة أينما كنت" },
  "why.p6.d": {
    en: "Cairo, Alexandria, Upper Egypt or abroad — the process and the level of attention are identical.",
    ar: "القاهرة أو الإسكندرية أو الصعيد أو الخارج — العملية ومستوى الاهتمام واحد.",
  },
  "why.steps": { en: "How a request moves", ar: "كيف يسير الطلب" },
  "why.s1": { en: "You tell us the destination and the purpose of travel.", ar: "تخبرنا بالوجهة وغرض السفر." },
  "why.s2": { en: "We send the exact document list and the cost.", ar: "نرسل قائمة المستندات المطلوبة والتكلفة." },
  "why.s3": { en: "You send scans; we check them and flag any gaps.", ar: "ترسل النسخ؛ نراجعها ونحدد أي نواقص." },
  "why.s4": { en: "We submit, follow up and update you until the result.", ar: "نقدّم الطلب ونتابع ونحدّثك حتى النتيجة." },

  "info.title": { en: "Info / About", ar: "إنفو / معلومات" },
  "info.who": { en: "Who we are", ar: "من نحن" },
  "info.whoD": {
    en: "GlobeVisa Online is an Egyptian travel and visa services company. We help travellers plan trips inside Egypt, prepare and follow up visa files for travel abroad, and book flights — with the whole process handled online.",
    ar: "جلوب فيزا أونلاين شركة مصرية لخدمات السفر والتأشيرات. نساعد المسافرين على تنظيم رحلاتهم داخل مصر، وإعداد ومتابعة ملفات التأشيرات للسفر للخارج، وحجز الطيران — والعملية بالكامل تتم أونلاين.",
  },
  "info.what": { en: "What we provide", ar: "ماذا نقدم" },
  "info.w1": { en: "Domestic trips and stays across Egypt.", ar: "رحلات وإقامات داخل مصر." },
  "info.w2": { en: "International travel planning for tourism and business.", ar: "تخطيط السفر الخارجي للسياحة والبيزنس." },
  "info.w3": { en: "Visa document preparation, review and follow-up.", ar: "إعداد ومراجعة ومتابعة مستندات التأشيرة." },
  "info.w4": { en: "Flight search, booking and ticket issuing.", ar: "البحث والحجز وإصدار تذاكر الطيران." },
  "info.approach": { en: "How we work", ar: "أسلوبنا" },
  "info.approachD": {
    en: "Clear requirements before you pay, written answers, one point of contact for your file, and no promises about approvals that are not ours to give — decisions belong to the embassies and consulates.",
    ar: "متطلبات واضحة قبل الدفع، إجابات مكتوبة، جهة تواصل واحدة لملفك، وعدم إعطاء وعود بالموافقات لأنها قرار السفارات والقنصليات وليس قرارنا.",
  },
  "info.owner": { en: "Company owner", ar: "صاحب الشركة" },
  "info.ownerD": {
    en: "Owner details will be published here once provided by the company.",
    ar: "بيانات صاحب الشركة ستُضاف هنا فور توفيرها من الشركة.",
  },
  "info.placeholder": { en: "To be provided", ar: "سيتم توفيرها" },

  "ct.title": { en: "Contact Us", ar: "تواصل معنا" },
  "ct.lead": {
    en: "Reach us by phone or WhatsApp. Send the destination and the purpose of travel in your first message and you will get the requirement list back.",
    ar: "تواصل معنا هاتفياً أو عبر واتساب. أرسل الوجهة وغرض السفر في أول رسالة وستصلك قائمة المتطلبات.",
  },
  "ct.phone": { en: "Mobile phone", ar: "الهاتف المحمول" },
  "ct.whatsapp": { en: "WhatsApp", ar: "واتساب" },
  "ct.call": { en: "Call now", ar: "اتصل الآن" },
  "ct.chat": { en: "Chat on WhatsApp", ar: "محادثة واتساب" },
  "ct.pending": { en: "Number to be added", ar: "الرقم سيتم إضافته" },
  "ct.form": { en: "Or send your details", ar: "أو أرسل بياناتك" },
  "ct.name": { en: "Full name", ar: "الاسم بالكامل" },
  "ct.contactField": { en: "Phone or email", ar: "الهاتف أو البريد الإلكتروني" },
  "ct.message": { en: "How can we help?", ar: "كيف يمكننا مساعدتك؟" },
  "ct.send": { en: "Send request", ar: "إرسال الطلب" },
  "ct.ok": { en: "Thank you. Your request is ready to be sent to our team.", ar: "شكراً لك. طلبك جاهز للإرسال إلى فريقنا." },
  "ct.required": { en: "Please complete the required fields.", ar: "يرجى استكمال الحقول المطلوبة." },

  "footer.rights": { en: "All rights reserved.", ar: "جميع الحقوق محفوظة." },
  "footer.creator": { en: "Creator", ar: "صانع الموقع" },
  "splash.phrase": { en: "Your Journey Starts Here ✈️", ar: "رحلتك تبدأ من هنا ✈️" },
  "footer.sections": { en: "Sections", ar: "الأقسام" },
  "footer.note": {
    en: "Visa decisions are issued by the relevant embassies and consulates.",
    ar: "قرارات التأشيرات تصدر عن السفارات والقنصليات المختصة.",
  },
  "common.back": { en: "Back to home", ar: "العودة للرئيسية" },
  "common.cancel": { en: "Cancel", ar: "إلغاء" },
  "common.save": { en: "Save changes", ar: "حفظ التغييرات" },
  "common.saving": { en: "Saving…", ar: "جارٍ الحفظ…" },
  "common.loading": { en: "Loading…", ar: "جارٍ التحميل…" },

  "theme.toDark": { en: "Switch to dark mode", ar: "التبديل إلى الوضع الليلي" },
  "theme.toLight": { en: "Switch to light mode", ar: "التبديل إلى الوضع النهاري" },

  "search.open": { en: "Search", ar: "بحث" },
  "search.close": { en: "Close search", ar: "إغلاق البحث" },
  "search.placeholder": {
    en: "Search destinations, flights, services…",
    ar: "ابحث عن وجهات أو طيران أو خدمات…",
  },
  "search.hint": { en: "Type to search the website", ar: "اكتب للبحث في الموقع" },
  "search.results": { en: "Results", ar: "النتائج" },
  "search.none": { en: "No results found", ar: "لا توجد نتائج" },
  "search.noneHint": {
    en: "Try a destination, a service or the word “visa”.",
    ar: "جرّب اسم وجهة أو خدمة أو كلمة «تأشيرة».",
  },
  "search.popular": { en: "Popular searches", ar: "الأكثر بحثاً" },
  "search.cat.pages": { en: "Pages", ar: "الصفحات" },
  "search.cat.destinations": { en: "Destinations", ar: "الوجهات" },
  "search.cat.services": { en: "Services", ar: "الخدمات" },
  "search.cat.flights": { en: "Flights", ar: "الطيران" },
  "search.cat.offers": { en: "Travel offers", ar: "عروض السفر" },
  "search.offer.review": { en: "Free document pre-check", ar: "مراجعة مجانية للمستندات" },
  "search.offer.reviewD": {
    en: "We review your scans and flag gaps before submission.",
    ar: "نراجع مستنداتك ونحدد النواقص قبل التقديم.",
  },
  "search.offer.fast": { en: "Same-day flight quotes", ar: "عروض طيران في نفس اليوم" },
  "search.offer.fastD": {
    en: "Send your route and receive fares the same day.",
    ar: "أرسل خط سيرك واستلم الأسعار في نفس اليوم.",
  },

  "auth.login": { en: "Login", ar: "تسجيل الدخول" },
  "auth.loginSignup": { en: "Login / Sign Up", ar: "تسجيل الدخول / حساب جديد" },
  "auth.signup": { en: "Create account", ar: "إنشاء حساب" },
  "auth.logout": { en: "Log out", ar: "تسجيل الخروج" },
  "auth.email": { en: "Email address", ar: "البريد الإلكتروني" },
  "auth.password": { en: "Password", ar: "كلمة المرور" },
  "auth.newPassword": { en: "New password", ar: "كلمة المرور الجديدة" },
  "auth.confirmPassword": { en: "Confirm password", ar: "تأكيد كلمة المرور" },
  "auth.fullName": { en: "Full name", ar: "الاسم بالكامل" },
  "auth.phone": { en: "Phone number", ar: "رقم الهاتف" },
  "auth.google": { en: "Continue with Google", ar: "المتابعة عبر جوجل" },
  "auth.or": { en: "or", ar: "أو" },
  "auth.haveAccount": { en: "Already have an account?", ar: "لديك حساب بالفعل؟" },
  "auth.noAccount": { en: "New to GlobeVisa Online?", ar: "جديد على جلوب فيزا أونلاين؟" },
  "auth.forgot": { en: "Forgot your password?", ar: "نسيت كلمة المرور؟" },
  "auth.reset": { en: "Reset password", ar: "إعادة تعيين كلمة المرور" },
  "auth.resetLead": {
    en: "Enter your email and we will send you a secure link to set a new password.",
    ar: "أدخل بريدك الإلكتروني وسنرسل لك رابطاً آمناً لتعيين كلمة مرور جديدة.",
  },
  "auth.resetSent": {
    en: "If an account exists for this email, a reset link is on its way.",
    ar: "إذا كان هناك حساب بهذا البريد، فسيصلك رابط إعادة التعيين.",
  },
  "auth.resetSend": { en: "Send reset link", ar: "إرسال الرابط" },
  "auth.backToLogin": { en: "Back to login", ar: "العودة لتسجيل الدخول" },
  "auth.loginLead": {
    en: "Sign in to follow your requests, review your bookings and keep your traveller details saved.",
    ar: "سجّل الدخول لمتابعة طلباتك ومراجعة حجوزاتك وحفظ بيانات السفر الخاصة بك.",
  },
  "auth.signupLead": {
    en: "Create an account to save your traveller details and track every request in one place.",
    ar: "أنشئ حساباً لحفظ بيانات السفر ومتابعة كل طلباتك في مكان واحد.",
  },
  "auth.signupOk": {
    en: "Account created. Check your inbox to confirm your email if required.",
    ar: "تم إنشاء الحساب. تحقق من بريدك لتأكيد الحساب إذا لزم الأمر.",
  },
  "auth.title": { en: "Customer account", ar: "حساب العميل" },
  "auth.mismatch": { en: "Passwords do not match.", ar: "كلمتا المرور غير متطابقتين." },
  "auth.short": { en: "Password must be at least 8 characters.", ar: "كلمة المرور يجب ألا تقل عن 8 أحرف." },
  "auth.setNew": { en: "Set a new password", ar: "تعيين كلمة مرور جديدة" },
  "auth.updated": { en: "Password updated.", ar: "تم تحديث كلمة المرور." },

  "acc.title": { en: "My account", ar: "حسابي" },
  "acc.lead": {
    en: "Your personal details, saved travel information and password settings.",
    ar: "بياناتك الشخصية ومعلومات السفر المحفوظة وإعدادات كلمة المرور.",
  },
  "acc.menu": { en: "Account", ar: "الحساب" },
  "acc.profile": { en: "Profile", ar: "الملف الشخصي" },
  "acc.bookings": { en: "My bookings", ar: "حجوزاتي" },
  "acc.bookingsLead": {
    en: "Every request you have sent us, with its current status.",
    ar: "كل طلب أرسلته لنا مع حالته الحالية.",
  },
  "acc.personal": { en: "Personal information", ar: "المعلومات الشخصية" },
  "acc.saved": { en: "Saved travel information", ar: "معلومات السفر المحفوظة" },
  "acc.country": { en: "Country of residence", ar: "بلد الإقامة" },
  "acc.passport": { en: "Passport number", ar: "رقم جواز السفر" },
  "acc.notes": { en: "Notes for our team", ar: "ملاحظات لفريقنا" },
  "acc.security": { en: "Password & security", ar: "كلمة المرور والأمان" },
  "acc.changePassword": { en: "Change password", ar: "تغيير كلمة المرور" },
  "acc.saved.ok": { en: "Your information has been saved.", ar: "تم حفظ بياناتك." },
  "acc.empty": { en: "You have no bookings yet.", ar: "لا توجد حجوزات حتى الآن." },
  "acc.emptyHint": {
    en: "Send a domestic, international or flight request and it will appear here.",
    ar: "أرسل طلب رحلة داخلية أو خارجية أو طيران وسيظهر هنا.",
  },
  "acc.view": { en: "View details", ar: "عرض التفاصيل" },
  "acc.reference": { en: "Reference", ar: "الرقم المرجعي" },
  "acc.created": { en: "Created", ar: "تاريخ الإنشاء" },
  "acc.status": { en: "Status", ar: "الحالة" },
  "acc.details": { en: "Request details", ar: "تفاصيل الطلب" },
  "acc.backToBookings": { en: "Back to bookings", ar: "العودة للحجوزات" },
  "acc.notFound": { en: "Booking not found.", ar: "لم يتم العثور على الحجز." },
  "acc.delete": { en: "Delete booking", ar: "حذف الحجز" },
  "acc.status.pending": { en: "Pending review", ar: "قيد المراجعة" },
  "acc.status.confirmed": { en: "Confirmed", ar: "مؤكد" },
  "acc.status.completed": { en: "Completed", ar: "مكتمل" },
  "acc.status.cancelled": { en: "Cancelled", ar: "ملغي" },
  "acc.kind.domestic": { en: "Domestic trip", ar: "رحلة داخلية" },
  "acc.kind.international": { en: "International travel", ar: "سفر خارجي" },
  "acc.kind.flight": { en: "Flight request", ar: "طلب طيران" },
  "acc.kind.general": { en: "General request", ar: "طلب عام" },
  "acc.signInRequired": { en: "Please sign in to view this page.", ar: "يرجى تسجيل الدخول لعرض هذه الصفحة." },

  "book.save": { en: "Save this request to my account", ar: "احفظ هذا الطلب في حسابي" },
  "book.saved": { en: "Saved to your account.", ar: "تم الحفظ في حسابك." },
  "book.signInToSave": { en: "Sign in to save this request", ar: "سجّل الدخول لحفظ هذا الطلب" },

  "products.eyebrow": { en: "Offers", ar: "العروض" },
  "products.title": { en: "Featured packages & offers", ar: "الباقات والعروض المميزة" },
  "products.lead": {
    en: "Hand-picked travel packages, visa services and flight offers, updated regularly.",
    ar: "باقات سفر وخدمات تأشيرات وعروض طيران مختارة بعناية، ويتم تحديثها باستمرار.",
  },
  "products.enquire": { en: "Enquire now", ar: "اطلب الآن" },
};


type Ctx = { lang: Lang; dir: "ltr" | "rtl"; setLang: (l: Lang) => void; toggle: () => void; t: (k: string) => string };

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [overrides, setOverrides] = useState<Dict>({});

  useEffect(() => {
    const stored = window.localStorage.getItem("gv-lang");
    if (stored === "ar" || stored === "en") setLangState(stored);
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data } = await supabase.from("site_content").select("key,value_en,value_ar");
      if (cancelled || !data) return;
      const next: Dict = {};
      for (const row of data) {
        const base = dict[row.key];
        next[row.key] = {
          en: row.value_en ?? base?.en ?? row.key,
          ar: row.value_ar ?? base?.ar ?? row.key,
        };
      }
      setOverrides(next);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.dataset["lang"] = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("gv-lang", l);
  }, []);

  const t = useCallback(
    (k: string) => overrides[k]?.[lang] || dict[k]?.[lang] || k,
    [lang, overrides],
  );

  const value = useMemo<Ctx>(
    () => ({ lang, dir: lang === "ar" ? "rtl" : "ltr", setLang, toggle: () => setLang(lang === "en" ? "ar" : "en"), t }),
    [lang, setLang, t],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}