export type Lang = 'en' | 'ar'

interface Chapter {
  id: string
  kicker: string
  title: string
  title2?: string
  copy: string
  tags?: string[]
  cta?: string
  cta2?: string
}

export interface AppContent {
  dir: 'ltr' | 'rtl'
  brandName: string
  nav: { menu: string; story: string; order: string }
  hero: { eyebrow: string; title: string; sub: string; scroll: string }
  chapters: Chapter[]
  menu: {
    kicker: string
    title: string
    items: { name: string; desc: string; price: string }[]
  }
  brandMoment: { line1: string; line2: string }
  finalCta: { title: string; button: string; locations: string; follow: string }
  reducedMotionNote: string
}

export const content: Record<Lang, AppContent> = {
  en: {
    dir: 'ltr',
    brandName: 'LIKE',
    nav: { menu: 'Menu', story: 'Story', order: 'Order Now' },
    hero: {
      eyebrow: 'THE LIKE EXPERIENCE',
      title: 'LOVE IT KRISPY-ER!',
      sub: 'Scroll to discover how crispy becomes irresistible.',
      scroll: 'SCROLL TO COOK',
    },
    chapters: [
      {
        id: 'chicken',
        kicker: 'CHAPTER 01',
        title: 'IT STARTS FRESH.',
        copy: 'Great crunch begins with the right chicken.',
      },
      {
        id: 'marinade',
        kicker: 'CHAPTER 02',
        title: 'SOAKED IN FLAVOR.',
        copy: 'Every bite gets seasoned from the inside out.',
        tags: ['PAPRIKA', 'GARLIC', 'BLACK PEPPER', 'HERBS'],
      },
      {
        id: 'coating',
        kicker: 'CHAPTER 03',
        title: 'COATED FOR THE CRUNCH.',
        copy: 'Every ridge matters.',
      },
      {
        id: 'fryer',
        kicker: 'CHAPTER 04',
        title: 'THIS IS WHERE THE MAGIC HAPPENS.',
        copy: 'HOT. GOLDEN. KRISPY.',
      },
      {
        id: 'reveal',
        kicker: 'CHAPTER 05',
        title: 'HEAR THAT?',
        title2: "THAT'S LIKE.",
        copy: 'Crackling crust. Steam escaping. Juice inside.',
      },
      {
        id: 'drop',
        kicker: 'CHAPTER 06',
        title: 'MADE TO BE KRISPY.',
        copy: 'Order your LIKE meal, fresh from the fryer to your door.',
        cta: 'ORDER YOUR LIKE',
        cta2: 'EXPLORE THE MENU',
      },
    ],
    menu: {
      kicker: 'THE MENU',
      title: 'Pick your crunch.',
      items: [
        { name: 'Signature Fried Chicken', desc: 'Our original recipe, 11 spices deep.', price: '$8.90' },
        { name: 'Spicy Chicken', desc: 'Fiery marinade, dangerously crispy.', price: '$9.40' },
        { name: 'Chicken Burger', desc: 'Crunch stacked between soft brioche.', price: '$7.20' },
        { name: 'Tenders', desc: 'Hand-breaded, dipped your way.', price: '$6.50' },
        { name: 'Loaded Fries', desc: 'Golden fries, sauced and stacked.', price: '$5.90' },
        { name: 'Signature Sauces', desc: 'Six house-made dips, one obsession.', price: '$1.50' },
      ],
    },
    brandMoment: { line1: 'LOVE IT.', line2: 'KRISPY-ER.' },
    finalCta: {
      title: 'CRAVING LIKE YET?',
      button: 'ORDER NOW',
      locations: 'FIND A LOCATION',
      follow: 'FOLLOW LIKE',
    },
    reducedMotionNote: 'Motion reduced — showing a lighter version of the story.',
  },
  ar: {
    dir: 'rtl',
    brandName: 'لايك',
    nav: { menu: 'القائمة', story: 'القصة', order: 'اطلب الآن' },
    hero: {
      eyebrow: 'تجربة لايك',
      title: 'أحبها أكثر قرمشة!',
      sub: 'مرّر لتكتشف كيف يتحوّل القرمش إلى إدمان.',
      scroll: 'مرّر لتبدأ الطهي',
    },
    chapters: [
      {
        id: 'chicken',
        kicker: 'الفصل ٠١',
        title: 'تبدأ طازجة.',
        copy: 'القرمشة الحقيقية تبدأ بالدجاج المناسب.',
      },
      {
        id: 'marinade',
        kicker: 'الفصل ٠٢',
        title: 'منقوعة بالنكهة.',
        copy: 'كل قضمة متبّلة من الداخل إلى الخارج.',
        tags: ['بابريكا', 'ثوم', 'فلفل أسود', 'أعشاب'],
      },
      {
        id: 'coating',
        kicker: 'الفصل ٠٣',
        title: 'مغطاة من أجل القرمشة.',
        copy: 'كل تفصيلة مهمة.',
      },
      {
        id: 'fryer',
        kicker: 'الفصل ٠٤',
        title: 'هنا يحدث السحر.',
        copy: 'ساخنة. ذهبية. قرمشة.',
      },
      {
        id: 'reveal',
        kicker: 'الفصل ٠٥',
        title: 'سمعت هذا؟',
        title2: 'هذه لايك.',
        copy: 'قشرة مقرمشة، بخار يتصاعد، وعصارة بالداخل.',
      },
      {
        id: 'drop',
        kicker: 'الفصل ٠٦',
        title: 'صُنعت لتكون قرمشة.',
        copy: 'اطلب وجبة لايك، طازجة من المقلاة إلى بابك.',
        cta: 'اطلب لايك الآن',
        cta2: 'استكشف القائمة',
      },
    ],
    menu: {
      kicker: 'القائمة',
      title: 'اختر قرمشتك.',
      items: [
        { name: 'دجاج لايك المقرمش', desc: 'وصفتنا الأصلية، بـ١١ بهارًا.', price: '٨.٩٠ د' },
        { name: 'دجاج حار', desc: 'تتبيلة نارية، وقرمشة خطيرة.', price: '٩.٤٠ د' },
        { name: 'برجر الدجاج', desc: 'قرمشة بين طبقات بريوش طرية.', price: '٧.٢٠ د' },
        { name: 'تندرز', desc: 'مقرمشة يدويًا، بالطريقة التي تحبها.', price: '٦.٥٠ د' },
        { name: 'بطاطا محملة', desc: 'بطاطا ذهبية مع الصوص والإضافات.', price: '٥.٩٠ د' },
        { name: 'صوصات لايك', desc: 'ستة صوصات منزلية، وهوس واحد.', price: '١.٥٠ د' },
      ],
    },
    brandMoment: { line1: 'أحبها.', line2: 'أكثر قرمشة.' },
    finalCta: {
      title: 'تشتهي لايك الآن؟',
      button: 'اطلب الآن',
      locations: 'ابحث عن فرع',
      follow: 'تابع لايك',
    },
    reducedMotionNote: 'تم تقليل الحركة — نعرض نسخة أخف من القصة.',
  },
}
