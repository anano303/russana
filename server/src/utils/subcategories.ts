export const CLOTHING_CATEGORIES = ['მაისურები', 'კაბები', 'ჰუდები', 'სხვა'];

export const ACCESSORIES_CATEGORIES = ['კეპები', 'პანამები', 'სხვა'];

export const FOOTWEAR_CATEGORIES = ['სპორტული', 'ყოველდღიური', 'სხვა'];

export const SWIMWEAR_CATEGORIES = ['საცურაო კოსტუმები', 'სხვა'];

// Legacy categories (keeping for backward compatibility)
export const HANDMADE_CATEGORIES = [
  'კერამიკა',
  'ხის ნაკეთობები',
  'სამკაულები',
  'ტექსტილი',
  'მინანქარი',
  'სკულპტურები',
  'სხვა',
];

export const PAINTING_CATEGORIES = [
  'აბსტრაქცია',
  'პეიზაჟი',
  'პორტრეტი',
  'შავ-თეთრი',
  'ანიმაციური',
  'ციფრული ილუსტრაციები',
  'მინიატურა',
  'სხვა',
];

// Legacy categories mapping to new categories (for data migration)
export const CATEGORY_MAPPING = {
  // Map HANDMADE categories to ACCESSORIES
  კერამიკა: 'კეპები',
  'ხის ნაკეთობები': 'პანამები',
  სამკაულები: 'სხვა',
  ტექსტილი: 'სხვა',
  მინანქარი: 'სხვა',
  სკულპტურები: 'სხვა',

  // Map PAINTINGS categories to CLOTHING
  აბსტრაქცია: 'მაისურები',
  პეიზაჟი: 'მაისურები',
  პორტრეტი: 'მაისურები',
  'შავ-თეთრი': 'მაისურები',
  ანიმაციური: 'მაისურები',
  'ციფრული ილუსტრაციები': 'მაისურები',
  მინიატურა: 'მაისურები',
};
