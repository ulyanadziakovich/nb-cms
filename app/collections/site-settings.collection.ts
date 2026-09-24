import { defineCollection } from '#pruvious'

export default defineCollection({
  name: 'site-settings',
  mode: 'single',
  apiRoutes: { read: 'public' },
  fields: {
    logo: { type: 'image', options: { required: false, label: 'Logo (ikona)' } },
    email: { type: 'text', options: { required: true, default: 'biuro@nowoczesnebieszczady.pl' } },
    phone: { type: 'text', options: { required: true, default: '507 068 728' } },
    address: { type: 'text', options: { required: true, default: 'Ustrzyki Dolne, woj. podkarpackie' } },
    facebookUrl: { type: 'text', options: { required: false, default: 'https://www.facebook.com/nowoczesne.bieszczady/?locale=pl_PL' } },
    footerTagline: { type: 'text', options: { required: false, default: 'Stowarzyszenie działające na rzecz rozwoju regionu' } },
  },
})
