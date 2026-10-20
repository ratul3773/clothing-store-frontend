import type { Settings } from '@/data/site'

export type StaticPageKey = 'about' | 'faq' | 'shipping' | 'returns' | 'privacy' | 'terms'

export type StaticPageContent = {
  title: string
  eyebrow: string
  intro: string
  sections: { heading: string; paragraphs: string[]; items?: string[] }[]
}

export const staticPages: Record<StaticPageKey, (settings: Settings) => StaticPageContent> = {
  about: (settings) => ({
    title: 'About us',
    eyebrow: 'A little about the label',
    intro: `${settings.store.name} is a Dhaka-based menswear store focused on everyday shirts and pants made for life here.`,
    sections: [
      {
        heading: 'Everyday, considered',
        paragraphs: [
          'We believe getting dressed should feel simple. Our collection brings together easy-to-wear pieces, useful details, and styles that work beyond a single occasion.',
          'Browse the shop to see current styles, available sizes, colours, and product details. Each product page is the best source for the latest information about that item.',
        ],
      },
      {
        heading: 'Here to help',
        paragraphs: [
          'Need a hand choosing a size, checking an order, or arranging an exchange? Get in touch and our team will be happy to help.',
        ],
      },
    ],
  }),
  faq: (settings) => ({
    title: 'Frequently asked questions',
    eyebrow: 'Quick answers',
    intro: 'A few useful details about shopping, delivery, payment, and exchanges.',
    sections: [
      {
        heading: 'How do I place an order?',
        paragraphs: ['Choose a product, select an available colour and size, add it to your bag, and follow the checkout steps. We will confirm your order before it is packed.'],
      },
      {
        heading: 'Which payment methods are available?',
        paragraphs: [
          `Available methods at checkout include${settings.payments.cod ? ' cash on delivery' : ''}${settings.payments.cod && settings.payments.online ? ' and' : ''}${settings.payments.online ? ' online payment' : ''}${!settings.payments.cod && !settings.payments.online ? ' the payment options shown during checkout' : ''}. The options shown at checkout are the current ones for your order.`,
        ],
      },
      {
        heading: 'How much does delivery cost?',
        paragraphs: [
          `Delivery currently costs ${settings.delivery.dhaka} BDT in Dhaka and ${settings.delivery.outside} BDT outside Dhaka. Orders above ${settings.delivery.freeAbove} BDT qualify for free delivery. See our Shipping page for more information.`,
        ],
      },
      {
        heading: 'Can I exchange an item?',
        paragraphs: [
          `Eligible items can be exchanged within ${settings.orders.exchangeDays} days. Please review our Returns & Exchanges page for the conditions and contact us to arrange an exchange.`,
        ],
      },
      {
        heading: 'How can I check on my order?',
        paragraphs: ['Visit your account to review your orders, or contact us with the phone number used at checkout and your order number.'],
      },
      {
        heading: 'How do I contact the store?',
        paragraphs: [`Call ${settings.store.phone} or email ${settings.store.email}. You can also use our contact page.`],
      },
    ],
  }),
  shipping: (settings) => ({
    title: 'Shipping & delivery',
    eyebrow: 'Getting your order to you',
    intro: 'We deliver across Bangladesh. Delivery options and charges are shown again during checkout before you place your order.',
    sections: [
      {
        heading: 'Delivery charges',
        paragraphs: ['Current delivery charges are based on the delivery area:'],
        items: [
          `Inside Dhaka: ${settings.delivery.dhaka} BDT`,
          `Outside Dhaka: ${settings.delivery.outside} BDT`,
          `Free delivery on orders above ${settings.delivery.freeAbove} BDT`,
        ],
      },
      {
        heading: 'Order processing',
        paragraphs: [
          'Our team confirms each order before packing. We will contact you if we need to verify your delivery details or discuss an issue with an item.',
          'Delivery timing can vary by location, courier availability, weather, and other circumstances. If you need an update, contact us with your order number.',
        ],
      },
      {
        heading: 'At delivery',
        paragraphs: [
          'Please check the parcel and items when they arrive. If you notice a problem, let the delivery rider and our team know as soon as possible.',
        ],
      },
    ],
  }),
  returns: (settings) => ({
    title: 'Returns & exchanges',
    eyebrow: 'A better fit',
    intro: `If something is not quite right, contact us within ${settings.orders.exchangeDays} days of receiving your order and we will help with the next steps.`,
    sections: [
      {
        heading: 'Exchange eligibility',
        paragraphs: [
          'To be eligible for an exchange, an item must be unused, unwashed, and in its original condition with tags and packaging intact. Items showing wear, damage, washing, or alteration may not be accepted.',
          'Some items may not be eligible for exchange for hygiene or other practical reasons. Please contact us before sending anything back so we can confirm eligibility and availability.',
        ],
      },
      {
        heading: 'How to request an exchange',
        paragraphs: [
          'Contact us with your order number, the item you would like to exchange, and the size or item you would prefer. Our team will confirm availability and explain how to proceed.',
          'Please wait for our instructions before handing an item to a courier. Delivery or exchange charges, if any, will be confirmed with you before the exchange is arranged.',
        ],
      },
      {
        heading: 'Incorrect, damaged, or missing items',
        paragraphs: [
          'If an item arrives damaged, incorrect, or missing, contact us as soon as possible with your order number and a description of the issue. Photos can help us review it quickly.',
        ],
      },
      {
        heading: 'Refunds',
        paragraphs: [
          'Please contact us if an order issue cannot be resolved with an exchange. We will review the circumstances and confirm any available resolution and its timing with you.',
        ],
      },
    ],
  }),
  privacy: (settings) => ({
    title: 'Privacy policy',
    eyebrow: 'Your information',
    intro: `This policy explains how ${settings.store.name} handles information when you browse our store, place an order, or contact us.`,
    sections: [
      {
        heading: 'Information we collect',
        paragraphs: ['Depending on how you use the store, information may include:'],
        items: [
          'Contact and delivery details you provide, such as your name, phone number, email address, and delivery address.',
          'Order details, including products, sizes, payment method, and order history.',
          'Messages and information you choose to share when contacting customer support.',
          'Basic technical information required for the site to function and help us understand service issues.',
        ],
      },
      {
        heading: 'How we use information',
        paragraphs: ['We use relevant information to:'],
        items: [
          'Process, confirm, deliver, and support your orders.',
          'Respond to questions and handle exchanges or order issues.',
          'Maintain store operations, prevent misuse, and improve the shopping experience.',
          'Meet applicable legal or record-keeping requirements.',
        ],
      },
      {
        heading: 'When information is shared',
        paragraphs: [
          'We share only the information needed with service providers who help operate the store, such as delivery partners and payment providers. We may also disclose information when required by law or to protect the store, customers, and others.',
          'We do not sell your personal information.',
        ],
      },
      {
        heading: 'Retention and security',
        paragraphs: [
          'We keep information for as long as it is reasonably needed to fulfil the purposes above, resolve issues, and meet applicable obligations. We take reasonable steps to protect it, but no method of electronic storage or transmission can be guaranteed to be completely secure.',
        ],
      },
      {
        heading: 'Your choices and questions',
        paragraphs: [
          'You may contact us to ask about or correct the personal information associated with your orders, subject to applicable record-keeping requirements. Contact us at the details below for privacy questions or requests.',
          `${settings.store.email} · ${settings.store.phone}`,
        ],
      },
      {
        heading: 'Updates to this policy',
        paragraphs: ['We may update this policy as our store or practices change. The current version will be available on this page.'],
      },
    ],
  }),
  terms: (settings) => ({
    title: 'Terms & conditions',
    eyebrow: 'Store terms',
    intro: `These terms apply when you browse or shop with ${settings.store.name}. By placing an order, you agree to the terms below.`,
    sections: [
      {
        heading: 'Products and availability',
        paragraphs: [
          'We aim to show product descriptions, colours, sizes, and prices accurately. Screen settings may affect how colours appear, and stock can change. Product availability is confirmed when we review your order.',
        ],
      },
      {
        heading: 'Orders and payment',
        paragraphs: [
          'Submitting checkout details is a request to place an order, not confirmation that the order has been accepted. Our team may contact you to confirm availability, delivery details, or other information before packing.',
          `Payment methods available for an order are shown during checkout. Current delivery charges and exchange information are set out on our Shipping and Returns & Exchanges pages.`,
        ],
      },
      {
        heading: 'Delivery and exchanges',
        paragraphs: [
          'Delivery estimates may vary by location and courier conditions. Please provide accurate contact and delivery details. Exchanges are subject to the eligibility requirements and time limit on our Returns & Exchanges page.',
        ],
      },
      {
        heading: 'Responsible use',
        paragraphs: [
          'Please use the store lawfully and provide accurate information when ordering. Do not attempt to interfere with the site, misuse another person’s information, or place fraudulent orders.',
        ],
      },
      {
        heading: 'Changes and contact',
        paragraphs: [
          'Product details, prices, and these terms may be updated as the store changes. Updates to terms apply from the time they are published and do not remove rights that cannot be limited under applicable law.',
          `Questions about these terms? Contact ${settings.store.email} or call ${settings.store.phone}.`,
        ],
      },
    ],
  }),
}
