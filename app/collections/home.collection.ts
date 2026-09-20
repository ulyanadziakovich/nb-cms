import { defineCollection } from '#pruvious'

export default defineCollection({
  name: 'home',
  mode: 'single',
  apiRoutes: { read: 'public' },
  fields: {
    heroKicker: { type: 'text', options: { required: false, default: 'Ustrzyki Dolne · Bieszczady' } },
    heroTitle: { type: 'text', options: { required: true, default: 'NOWOCZESNE BIESZCZADY' } },
    heroSubtitle: { type: 'text-area', options: { required: true, rows: 2, default: 'Tworzymy wydarzenia, konkursy i inicjatywy, które budują tożsamość regionu.' } },
    heroCta: { type: 'text', options: { required: false, default: 'Dowiedz się więcej' } },
    heroCtaHref: { type: 'text', options: { required: false, default: '/o-nas/misja' } },
    aboutKicker: { type: 'text', options: { required: false, default: 'Stowarzyszenie' } },
    aboutTitle: { type: 'text', options: { required: false, default: 'Krótko o nas' } },
    aboutParagraph1: { type: 'text-area', options: { required: true, rows: 3 } },
    aboutParagraph2: { type: 'text-area', options: { required: true, rows: 3 } },
    aboutTagline: { type: 'text', options: { required: false, default: '„SKUTECZNI DLA WAS”' } },
    aboutImage: { type: 'text', options: { required: false, label: 'Zdjęcie (URL)', default: '/images/bieszczady.avif' } },
  },
})
