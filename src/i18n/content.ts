export type Lang = 'en' | 'ar'

interface Chapter {
  id: string
  title: string
  title2?: string
  copy: string
  tags?: string[]
  cta?: string
  cta2?: string
  /** short vertical caption stacked in the left margin */
  sideLabel: string[]
  /** handwritten accent line in the right margin */
  script: string
  /** two-line circular stamp badge */
  badge: { top: string; bottom: string }
  /** label shown in the scroll hint while this chapter is active */
  scrollLabel: string
}

export interface AppContent {
  dir: 'ltr' | 'rtl'
  brandName: string
  brandTagline: string
  nav: { menu: string; story: string; locations: string; order: string }
  hero: { title: string; sub: string; scroll: string }
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
    brandTagline: 'LOVE IT KRISPY ER!',
    nav: { menu: 'Menu', story: 'Story', locations: 'Locations', order: 'Order Now' },
    hero: {
      title: 'LOVE IT KRISPY-ER!',
      sub: 'Scroll to discover how crispy becomes irresistible.',
      scroll: 'SCROLL TO COOK',
    },
    chapters: [
      {
        id: 'chicken',
        title: 'IT STARTS FRESH.',
        copy: 'Great crunch begins with the right chicken.',
        sideLabel: ['FRESH', 'CHICKEN', 'BRINGS', 'BETTER FLAVOR'],
        script: 'Same Care. Crispier Moments.',
        badge: { top: 'REAL INGREDIENTS', bottom: 'HAPPIER PEOPLE' },
        scrollLabel: 'SCROLL TO EXPLORE',
      },
      {
        id: 'marinade',
        title: 'SOAKED IN FLAVOR.',
        copy: 'Every bite gets seasoned from the inside out.',
        tags: ['PAPRIKA', 'GARLIC', 'BLACK PEPPER', 'HERBS'],
        sideLabel: ['SIGNATURE', 'SPICES', 'BOLDER', 'BITES'],
        script: 'Same Love. Crispier Reality.',
        badge: { top: 'REAL CHICKEN', bottom: 'HAPPIER PEOPLE' },
        scrollLabel: 'SCROLL TO DISCOVER',
      },
      {
        id: 'coating',
        title: 'COATED FOR THE CRUNCH.',
        copy: 'Every ridge matters.',
        sideLabel: ['SEASONED', 'FLOUR TURNS', 'GOOD', 'INTO GREAT'],
        script: 'Same Love. Crispier Reality.',
        badge: { top: 'REAL CHICKEN', bottom: 'HAPPIER PEOPLE' },
        scrollLabel: 'SCROLL TO CONTINUE',
      },
      {
        id: 'fryer',
        title: 'THIS IS WHERE THE MAGIC HAPPENS.',
        copy: 'HOT. GOLDEN. KRISPY.',
        sideLabel: ['REAL CHICKEN', 'GOES', 'THROUGH', 'GREAT THINGS'],
        script: 'Same Love. Crispier Reality.',
        badge: { top: 'REAL CHICKEN', bottom: 'HAPPIER PEOPLE' },
        scrollLabel: 'SCROLL TO CONTINUE',
      },
      {
        id: 'reveal',
        title: 'HEAR THAT?',
        title2: "THAT'S LIKE.",
        copy: 'Crackling crust. Steam escaping. Juice inside.',
        sideLabel: ['CRUNCH', 'YOU CAN', 'ACTUALLY', 'HEAR'],
        script: 'Same Love. Crispier Reality.',
        badge: { top: 'REAL CHICKEN', bottom: 'HAPPIER PEOPLE' },
        scrollLabel: 'SCROLL TO CONTINUE',
      },
      {
        id: 'drop',
        title: 'MADE TO BE KRISPY.',
        copy: 'Real Chicken. Happier People.',
        cta: 'ORDER YOUR LIKE',
        cta2: 'EXPLORE THE MENU',
        sideLabel: ['CHICKEN', 'BRINGS', 'PEOPLE', 'CLOSER'],
        script: 'Same Love. Crispier Reality.',
        badge: { top: 'REAL CHICKEN', bottom: 'HAPPIER PEOPLE' },
        scrollLabel: 'SCROLL TO THE MENU',
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
    brandTagline: 'أحبها أكثر قرمشة!',
    nav: { menu: 'القائمة', story: 'القصة', locations: 'الفروع', order: 'اطلب الآن' },
    hero: {
      title: 'أحبها أكثر قرمشة!',
      sub: 'مرّر لتكتشف كيف يتحوّل القرمش إلى إدمان.',
      scroll: 'مرّر لتبدأ الطهي',
    },
    chapters: [
      {
        id: 'chicken',
        title: 'تبدأ طازجة.',
        copy: 'القرمشة الحقيقية تبدأ بالدجاج المناسب.',
        sideLabel: ['دجاج', 'طازج', 'لنكهة', 'أفضل'],
        script: 'نفس الاهتمام. لحظات أقرمش.',
        badge: { top: 'مكونات حقيقية', bottom: 'ناس أسعد' },
        scrollLabel: 'مرّر لتكتشف',
      },
      {
        id: 'marinade',
        title: 'منقوعة بالنكهة.',
        copy: 'كل قضمة متبّلة من الداخل إلى الخارج.',
        tags: ['بابريكا', 'ثوم', 'فلفل أسود', 'أعشاب'],
        sideLabel: ['بهارات', 'مميزة', 'قضمات', 'أجرأ'],
        script: 'نفس الحب. واقع أقرمش.',
        badge: { top: 'دجاج حقيقي', bottom: 'ناس أسعد' },
        scrollLabel: 'مرّر للمزيد',
      },
      {
        id: 'coating',
        title: 'مغطاة من أجل القرمشة.',
        copy: 'كل تفصيلة مهمة.',
        sideLabel: ['دقيق', 'متبّل', 'يحوّل الجيد', 'إلى رائع'],
        script: 'نفس الحب. واقع أقرمش.',
        badge: { top: 'دجاج حقيقي', bottom: 'ناس أسعد' },
        scrollLabel: 'مرّر للمتابعة',
      },
      {
        id: 'fryer',
        title: 'هنا يحدث السحر.',
        copy: 'ساخنة. ذهبية. قرمشة.',
        sideLabel: ['دجاج حقيقي', 'يمر', 'بأشياء', 'عظيمة'],
        script: 'نفس الحب. واقع أقرمش.',
        badge: { top: 'دجاج حقيقي', bottom: 'ناس أسعد' },
        scrollLabel: 'مرّر للمتابعة',
      },
      {
        id: 'reveal',
        title: 'سمعت هذا؟',
        title2: 'هذه لايك.',
        copy: 'قشرة مقرمشة، بخار يتصاعد، وعصارة بالداخل.',
        sideLabel: ['قرمشة', 'تسمعها', 'فعلاً', 'بأذنك'],
        script: 'نفس الحب. واقع أقرمش.',
        badge: { top: 'دجاج حقيقي', bottom: 'ناس أسعد' },
        scrollLabel: 'مرّر للمتابعة',
      },
      {
        id: 'drop',
        title: 'صُنعت لتكون قرمشة.',
        copy: 'دجاج حقيقي. ناس أسعد.',
        cta: 'اطلب لايك الآن',
        cta2: 'استكشف القائمة',
        sideLabel: ['الدجاج', 'يجمع', 'الناس', 'أكثر'],
        script: 'نفس الحب. واقع أقرمش.',
        badge: { top: 'دجاج حقيقي', bottom: 'ناس أسعد' },
        scrollLabel: 'مرّر إلى القائمة',
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
