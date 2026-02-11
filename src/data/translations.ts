import type { Language } from "@/types";

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // App
    appName: "Madina Lab",
    tagline: "Your Digital Community Companion",

    // Navigation
    navHome: "Home",
    navAthkar: "Athkar",
    navEvents: "Events",
    navChat: "Chat",
    navDirectory: "Directory",
    navAdmin: "Admin",
    navMyBusiness: "My Business",
    navProfile: "Profile",

    // Auth
    signIn: "Sign In",
    register: "Register",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    displayName: "Display Name",
    forgotPassword: "Forgot Password?",
    signInWithGoogle: "Sign in with Google",
    logout: "Logout",
    communityMember: "Community Member",
    businessOwner: "Business Owner",
    communityMemberDesc: "Join as a community member to access prayer times, events, chat, and more",
    businessOwnerDesc: "Register your Muslim-owned business and connect with the community",
    accountType: "Account Type",

    // Home
    welcomeGreeting: "Assalamu Alaikum",
    nextPrayer: "Next Prayer",
    activeEvents: "Active Events",
    unreadMessages: "Unread Messages",

    // Prayer names
    fajr: "Fajr",
    sunrise: "Sunrise",
    dhuhr: "Dhuhr",
    asr: "Asr",
    maghrib: "Maghrib",
    isha: "Isha",

    // Weather
    feelsLike: "Feels like",
    high: "High",
    low: "Low",

    // Athkar
    morning: "Morning",
    evening: "Evening",
    streak: "Streak",
    sessionProgress: "Session Progress",

    // General
    loading: "Loading...",
    error: "An error occurred",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    create: "Create",
    search: "Search...",
    noResults: "No results found",
    darkMode: "Dark Mode",
    language: "Language",
    about: "About",
    version: "Version",

    // Roles
    roleAdmin: "Admin",
    roleModerator: "Moderator",
    roleMember: "Member",
    roleBusiness: "Business",

    // Chat
    typeMessage: "Type a message...",
    groupChat: "Groups",
    directMessages: "Direct Messages",
    messageRemoved: "🚫 Message removed by moderator",

    // Events
    rsvp: "RSVP",
    rsvpd: "RSVP'd",
    pastEvents: "Past Events",
    upcoming: "Upcoming",
    allEvents: "All Events",
    eventCategories: "Categories",

    // Directory
    allCategories: "All Categories",
    halalCertified: "Halal Certified",
    verified: "Verified",
    claimBusiness: "Claim This Business",
    addBusiness: "Add Business",
    writeReview: "Write a Review",
    helpful: "Helpful",
    ownerResponse: "Owner Response",

    // Auth messages
    errorNameRequired: "Display name is required",
    errorPasswordShort: "Password must be at least 6 characters",
    errorPasswordMismatch: "Passwords do not match",
    errorEmailInUse: "This email is already registered",
    errorInvalidEmail: "Please enter a valid email",
    errorInvalidCredentials: "Invalid email or password",
    errorEmailRequired: "Please enter your email first",
    errorResetFailed: "Failed to send reset email",
    registerSuccess: "Account created successfully!",
    signInSuccess: "Welcome back!",
    resetEmailSent: "Password reset email sent",

    // Profile
    memberSince: "Member since",
    preferences: "Preferences",
    groups: "Groups",
    upgradeToBusiness: "Upgrade to Business Account",
    upgradedToBusiness: "Upgraded to Business Account!",
  },
  ar: {
    appName: "مدينة لاب",
    tagline: "رفيقك الرقمي في المجتمع",

    navHome: "الرئيسية",
    navAthkar: "الأذكار",
    navEvents: "الفعاليات",
    navChat: "الدردشة",
    navDirectory: "الدليل",
    navAdmin: "الإدارة",
    navMyBusiness: "أعمالي",
    navProfile: "الملف الشخصي",

    signIn: "تسجيل الدخول",
    register: "إنشاء حساب",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    confirmPassword: "تأكيد كلمة المرور",
    displayName: "الاسم المعروض",
    forgotPassword: "نسيت كلمة المرور؟",
    signInWithGoogle: "تسجيل الدخول بجوجل",
    logout: "تسجيل الخروج",
    communityMember: "عضو في المجتمع",
    businessOwner: "صاحب عمل",
    communityMemberDesc: "انضم كعضو في المجتمع للوصول إلى أوقات الصلاة والفعاليات والدردشة والمزيد",
    businessOwnerDesc: "سجّل عملك المملوك للمسلمين وتواصل مع المجتمع",
    accountType: "نوع الحساب",

    welcomeGreeting: "السلام عليكم",
    nextPrayer: "الصلاة القادمة",
    activeEvents: "الفعاليات النشطة",
    unreadMessages: "الرسائل غير المقروءة",

    fajr: "الفجر",
    sunrise: "الشروق",
    dhuhr: "الظهر",
    asr: "العصر",
    maghrib: "المغرب",
    isha: "العشاء",

    feelsLike: "يشعر وكأنه",
    high: "الأعلى",
    low: "الأدنى",

    morning: "الصباح",
    evening: "المساء",
    streak: "متتالية",
    sessionProgress: "تقدم الجلسة",

    loading: "جاري التحميل...",
    error: "حدث خطأ",
    save: "حفظ",
    cancel: "إلغاء",
    delete: "حذف",
    edit: "تعديل",
    create: "إنشاء",
    search: "بحث...",
    noResults: "لا توجد نتائج",
    darkMode: "الوضع الداكن",
    language: "اللغة",
    about: "حول",
    version: "الإصدار",

    roleAdmin: "مسؤول",
    roleModerator: "مشرف",
    roleMember: "عضو",
    roleBusiness: "صاحب عمل",

    typeMessage: "اكتب رسالة...",
    groupChat: "المجموعات",
    directMessages: "الرسائل المباشرة",
    messageRemoved: "🚫 تم حذف الرسالة بواسطة المشرف",

    rsvp: "تسجيل حضور",
    rsvpd: "تم التسجيل",
    pastEvents: "الفعاليات السابقة",
    upcoming: "القادمة",

    allCategories: "جميع الفئات",
    halalCertified: "حلال معتمد",
    verified: "موثق",
    claimBusiness: "المطالبة بهذا العمل",
    addBusiness: "إضافة عمل",
    writeReview: "كتابة مراجعة",
    helpful: "مفيد",
    ownerResponse: "رد المالك",

    errorNameRequired: "الاسم المعروض مطلوب",
    errorPasswordShort: "يجب أن تكون كلمة المرور 6 أحرف على الأقل",
    errorPasswordMismatch: "كلمتا المرور غير متطابقتين",
    errorEmailInUse: "هذا البريد الإلكتروني مسجل بالفعل",
    errorInvalidEmail: "يرجى إدخال بريد إلكتروني صالح",
    errorInvalidCredentials: "بريد إلكتروني أو كلمة مرور غير صالحة",
    errorEmailRequired: "يرجى إدخال بريدك الإلكتروني أولاً",
    errorResetFailed: "فشل إرسال رابط إعادة التعيين",
    registerSuccess: "تم إنشاء الحساب بنجاح!",
    signInSuccess: "!مرحباً بعودتك",
    resetEmailSent: "تم إرسال رابط إعادة تعيين كلمة المرور",

    memberSince: "عضو منذ",
    preferences: "التفضيلات",
    groups: "المجموعات",
    upgradeToBusiness: "الترقية إلى حساب تجاري",
    upgradedToBusiness: "!تمت الترقية إلى حساب تجاري",
  },
  ur: {
    appName: "مدینہ لیب",
    tagline: "آپ کا ڈیجیٹل کمیونٹی ساتھی",

    navHome: "ہوم",
    navAthkar: "اذکار",
    navEvents: "تقریبات",
    navChat: "چیٹ",
    navDirectory: "ڈائریکٹری",
    navAdmin: "ایڈمن",
    navMyBusiness: "میرا کاروبار",
    navProfile: "پروفائل",

    signIn: "سائن ان",
    register: "رجسٹر",
    email: "ای میل",
    password: "پاسورڈ",
    confirmPassword: "پاسورڈ کی تصدیق",
    displayName: "ظاہری نام",
    forgotPassword: "پاسورڈ بھول گئے؟",
    signInWithGoogle: "گوگل سے سائن ان",
    logout: "لاگ آؤٹ",
    communityMember: "کمیونٹی ممبر",
    businessOwner: "کاروبار مالک",
    communityMemberDesc: "نماز کے اوقات، تقریبات، چیٹ اور مزید تک رسائی کے لیے بطور کمیونٹی ممبر شامل ہوں",
    businessOwnerDesc: "اپنا مسلم ملکیتی کاروبار رجسٹر کریں اور کمیونٹی سے جڑیں",
    accountType: "اکاؤنٹ کی قسم",

    welcomeGreeting: "السلام علیکم",
    nextPrayer: "اگلی نماز",
    activeEvents: "فعال تقریبات",
    unreadMessages: "غیر پڑھے پیغامات",

    fajr: "فجر",
    sunrise: "طلوع آفتاب",
    dhuhr: "ظہر",
    asr: "عصر",
    maghrib: "مغرب",
    isha: "عشاء",

    feelsLike: "محسوس ہوتا ہے",
    high: "زیادہ",
    low: "کم",

    morning: "صبح",
    evening: "شام",
    streak: "سلسلہ",
    sessionProgress: "سیشن کی پیشرفت",

    loading: "لوڈ ہو رہا ہے...",
    error: "ایک خرابی واقع ہوئی",
    save: "محفوظ کریں",
    cancel: "منسوخ",
    delete: "حذف",
    edit: "ترمیم",
    create: "تخلیق",
    search: "تلاش...",
    noResults: "کوئی نتائج نہیں ملے",
    darkMode: "ڈارک موڈ",
    language: "زبان",
    about: "کے بارے میں",
    version: "ورژن",

    roleAdmin: "ایڈمن",
    roleModerator: "ماڈریٹر",
    roleMember: "ممبر",
    roleBusiness: "کاروبار",

    typeMessage: "پیغام لکھیں...",
    groupChat: "گروپس",
    directMessages: "براہ راست پیغامات",
    messageRemoved: "🚫 پیغام ماڈریٹر نے ہٹا دیا",

    rsvp: "حاضری",
    rsvpd: "حاضری درج",
    pastEvents: "گزشتہ تقریبات",
    upcoming: "آنے والی",

    allCategories: "تمام زمرے",
    halalCertified: "حلال تصدیق شدہ",
    verified: "تصدیق شدہ",
    claimBusiness: "اس کاروبار کا دعویٰ",
    addBusiness: "کاروبار شامل کریں",
    writeReview: "جائزہ لکھیں",
    helpful: "مددگار",
    ownerResponse: "مالک کا جواب",

    errorNameRequired: "ظاہری نام ضروری ہے",
    errorPasswordShort: "پاسورڈ کم از کم 6 حروف کا ہونا چاہیے",
    errorPasswordMismatch: "پاسورڈ مماثل نہیں ہیں",
    errorEmailInUse: "یہ ای میل پہلے سے رجسٹرڈ ہے",
    errorInvalidEmail: "براہ کرم ایک درست ای میل درج کریں",
    errorInvalidCredentials: "غلط ای میل یا پاسورڈ",
    errorEmailRequired: "پہلے اپنا ای میل درج کریں",
    errorResetFailed: "ری سیٹ ای میل بھیجنے میں ناکامی",
    registerSuccess: "!اکاؤنٹ کامیابی سے بنایا گیا",
    signInSuccess: "!خوش آمدید",
    resetEmailSent: "پاسورڈ ری سیٹ ای میل بھیج دی گئی",

    memberSince: "ممبر بنے",
    preferences: "ترجیحات",
    groups: "گروپس",
    upgradeToBusiness: "کاروباری اکاؤنٹ میں اپ گریڈ",
    upgradedToBusiness: "!کاروباری اکاؤنٹ میں اپ گریڈ ہو گیا",
  },
};

export const getDirection = (lang: Language): "rtl" | "ltr" => {
  return lang === "ar" || lang === "ur" ? "rtl" : "ltr";
};

export const getLanguageLabel = (lang: Language): string => {
  switch (lang) {
    case "en": return "EN";
    case "ar": return "ع";
    case "ur": return "اردو";
  }
};
