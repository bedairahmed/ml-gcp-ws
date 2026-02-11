export interface AthkarItem {
  id: number;
  arabic: string;
  transliteration: string;
  translation_en: string;
  translation_ur: string;
  source: string;
  count: number;
  morningOnly?: boolean;
  eveningOnly?: boolean;
}

export const athkarData: AthkarItem[] = [
  {
    id: 1,
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration: "Asbahna wa asbahal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la shareeka lah, lahul-mulku wa lahul-hamdu wa huwa 'ala kulli shay'in qadeer.",
    translation_en: "We have reached the morning and at this very time the whole kingdom belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah alone, without any partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent.",
    translation_ur: "ہم نے صبح کی اور تمام بادشاہت اللہ کی ہے، تمام تعریفیں اللہ کے لیے ہیں، اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، اسی کی بادشاہت ہے اور اسی کے لیے حمد ہے اور وہ ہر چیز پر قادر ہے۔",
    source: "Abu Dawud 4:317",
    count: 1,
    morningOnly: true,
  },
  {
    id: 2,
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration: "Amsayna wa amsal-mulku lillah, walhamdu lillah, la ilaha illallahu wahdahu la shareeka lah, lahul-mulku wa lahul-hamdu wa huwa 'ala kulli shay'in qadeer.",
    translation_en: "We have reached the evening and at this very time the whole kingdom belongs to Allah. All praise is for Allah. None has the right to be worshipped except Allah alone, without any partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent.",
    translation_ur: "ہم نے شام کی اور تمام بادشاہت اللہ کی ہے، تمام تعریفیں اللہ کے لیے ہیں، اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، اسی کی بادشاہت ہے اور اسی کے لیے حمد ہے اور وہ ہر چیز پر قادر ہے۔",
    source: "Abu Dawud 4:317",
    count: 1,
    eveningOnly: true,
  },
  {
    id: 3,
    arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ",
    transliteration: "Allahumma bika asbahna, wa bika amsayna, wa bika nahya, wa bika namootu, wa ilaykan-nushoor.",
    translation_en: "O Allah, by Your leave we have reached the morning, by Your leave we have reached the evening, by Your leave we live, by Your leave we die, and unto You is the resurrection.",
    translation_ur: "اے اللہ! تیرے ہی فضل سے ہم نے صبح کی اور تیرے ہی فضل سے شام کی، تیرے ہی فضل سے ہم جیتے ہیں اور تیرے ہی فضل سے مرتے ہیں اور تیری ہی طرف لوٹنا ہے۔",
    source: "At-Tirmidhi 5:466",
    count: 1,
    morningOnly: true,
  },
  {
    id: 4,
    arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ",
    transliteration: "Allahumma bika amsayna, wa bika asbahna, wa bika nahya, wa bika namootu, wa ilaykal-maseer.",
    translation_en: "O Allah, by Your leave we have reached the evening, by Your leave we have reached the morning, by Your leave we live, by Your leave we die, and unto You is the return.",
    translation_ur: "اے اللہ! تیرے ہی فضل سے ہم نے شام کی اور تیرے ہی فضل سے صبح کی، تیرے ہی فضل سے ہم جیتے ہیں اور تیرے ہی فضل سے مرتے ہیں اور تیری ہی طرف لوٹنا ہے۔",
    source: "At-Tirmidhi 5:466",
    count: 1,
    eveningOnly: true,
  },
  {
    id: 5,
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
    transliteration: "SubhanAllahi wa bihamdihi.",
    translation_en: "Glory is to Allah and praise is to Him.",
    translation_ur: "اللہ پاک ہے اور اس کی حمد ہے۔",
    source: "Muslim 4:2071",
    count: 100,
  },
  {
    id: 6,
    arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration: "La ilaha illallahu wahdahu la shareeka lah, lahul-mulku wa lahul-hamdu, wa huwa 'ala kulli shay'in qadeer.",
    translation_en: "None has the right to be worshipped except Allah alone, without partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent.",
    translation_ur: "اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے، اس کا کوئی شریک نہیں، بادشاہت اسی کی ہے اور حمد اسی کے لیے ہے اور وہ ہر چیز پر قادر ہے۔",
    source: "Bukhari 4:95, Muslim 4:2071",
    count: 10,
  },
  {
    id: 7,
    arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
    transliteration: "A'oodhu bikalimatillahit-tammati min sharri ma khalaq.",
    translation_en: "I seek refuge in the perfect words of Allah from the evil of that which He has created.",
    translation_ur: "میں اللہ کے مکمل کلمات کی پناہ مانگتا ہوں ہر اس چیز کے شر سے جو اس نے پیدا کی۔",
    source: "Muslim 4:2080",
    count: 3,
  },
  {
    id: 8,
    arabic: "بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ",
    transliteration: "Bismillahilladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa huwas-samee'ul-'aleem.",
    translation_en: "In the Name of Allah, with whose Name nothing on earth or in the heavens can cause harm, and He is the All-Hearing, the All-Knowing.",
    translation_ur: "اللہ کے نام سے جس کے نام کے ساتھ زمین و آسمان میں کوئی چیز نقصان نہیں دے سکتی اور وہ سب سننے والا جاننے والا ہے۔",
    source: "Abu Dawud 4:323, At-Tirmidhi 5:465",
    count: 3,
  },
  {
    id: 9,
    arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ",
    transliteration: "Allahumma 'aafini fee badani, Allahumma 'aafini fee sam'ee, Allahumma 'aafini fee basari, la ilaha illa ant.",
    translation_en: "O Allah, grant my body health. O Allah, grant my hearing health. O Allah, grant my sight health. None has the right to be worshipped except You.",
    translation_ur: "اے اللہ! میرے جسم میں عافیت دے، اے اللہ! میری سماعت میں عافیت دے، اے اللہ! میری بصارت میں عافیت دے، تیرے سوا کوئی معبود نہیں۔",
    source: "Abu Dawud 4:324",
    count: 3,
  },
  {
    id: 10,
    arabic: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ",
    transliteration: "Astaghfirullaha wa atoobu ilayh.",
    translation_en: "I seek the forgiveness of Allah and repent to Him.",
    translation_ur: "میں اللہ سے مغفرت چاہتا ہوں اور اس کی طرف توبہ کرتا ہوں۔",
    source: "Bukhari 11:101, Muslim 4:2075",
    count: 100,
  },
  {
    id: 11,
    arabic: "رَضِيتُ بِاللَّهِ رَبًّا، وَبِالْإِسْلَامِ دِينًا، وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا",
    transliteration: "Radheetu billahi rabba, wa bil-islami deena, wa bi-Muhammadin sallallahu 'alayhi wa sallama nabiyya.",
    translation_en: "I am pleased with Allah as my Lord, with Islam as my religion, and with Muhammad ﷺ as my Prophet.",
    translation_ur: "میں اللہ کو رب مان کر، اسلام کو دین مان کر اور محمد ﷺ کو نبی مان کر راضی ہوں۔",
    source: "Abu Dawud 4:318",
    count: 3,
  },
  {
    id: 12,
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ",
    transliteration: "SubhanAllahi wa bihamdihi, 'adada khalqihi, wa ridha nafsihi, wa zinata 'arshihi, wa midaada kalimatihi.",
    translation_en: "Glory is to Allah and praise is to Him, by the multitude of His creation, by His pleasure, by the weight of His Throne, and by the extent of His words.",
    translation_ur: "اللہ پاک ہے اپنی حمد کے ساتھ اپنی مخلوقات کی تعداد کے برابر، اپنی رضا کے برابر، اپنے عرش کے وزن کے برابر اور اپنے کلمات کی روشنائی کے برابر۔",
    source: "Muslim 4:2090",
    count: 3,
  },
  {
    id: 13,
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ",
    transliteration: "Allahumma innee as'alukal-'afwa wal-'aafiyata fid-dunya wal-aakhirah.",
    translation_en: "O Allah, I ask You for pardon and well-being in this life and the next.",
    translation_ur: "اے اللہ! میں تجھ سے دنیا اور آخرت میں معافی اور عافیت مانگتا ہوں۔",
    source: "Ibn Majah 2:332",
    count: 1,
  },
  {
    id: 14,
    arabic: "حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    transliteration: "Hasbiyallahu la ilaha illa huwa, 'alayhi tawakkaltu, wa huwa rabbul-'arshil-'adheem.",
    translation_en: "Allah is sufficient for me. There is no deity except Him. I have placed my trust in Him, and He is the Lord of the Great Throne.",
    translation_ur: "اللہ مجھے کافی ہے، اس کے سوا کوئی معبود نہیں، اسی پر میں نے بھروسا کیا اور وہ عرش عظیم کا رب ہے۔",
    source: "Abu Dawud 4:321",
    count: 7,
  },
];

export const getMorningAthkar = (): AthkarItem[] =>
  athkarData.filter((item) => !item.eveningOnly).slice(0, 10);

export const getEveningAthkar = (): AthkarItem[] =>
  athkarData.filter((item) => !item.morningOnly).slice(0, 10);
