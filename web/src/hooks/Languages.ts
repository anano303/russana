"use client";

export interface TranslationContent {
  [key: string]: string | string[] | TranslationContent;
}

export interface Translations {
  [key: string]: TranslationContent;
}

export const TRANSLATIONS: Translations = {
  ge: {
    // Navigation
    navigation: {
      home: "მთავარი",
      shop: "პროდუქტები",
      auction: "აუქციონი",
      myOrders: "ჩემი შეკვეთები",
      forum: "ფორუმი",
      about: "ჩვენს შესახებ",
      login: "შესვლა",
      profile: "პროფილი",
      orders: "შეკვეთები",
      adminPanel: "ადმინ პანელი",
      products: "პროდუქტები",
      users: "მომხმარებლები",
      logout: "გასვლა",
    },

    // Shop
    shop: {
      allArtworks: "ყველა პროდუქტი",
      artistWorks: "-ის პროდუქტები",
      loading: "იტვირთება...",
      filters: "ფილტრები",
      sort: "დალაგება",
      categories: "კატეგორიები",
      painters: "მხატვრები",
      priceRange: "ფასის დიაპაზონი",
      inStock: "მარაგშია",
      outOfStock: "არ არის მარაგში",
      mainCategory: "ძირითადი კატეგორია",
      searchPainter: "მოძებნე მხატვარი",
      authorCompany: "ავტორი/კომპანია",
      searchAuthorCompany: "მოძებნე ავტორი/კომპანია",
      defaultSort: "ნაგულისხმევი",
      priceLowToHigh: "ფასი: დაბლიდან მაღლისკენ",
      priceHighToLow: "ფასი: მაღლიდან დაბლისკენ",
      emptyDescription:
        "დაათვალიერეთ ჩვენი პლატფორმა და იპოვეთ უნიკალური პროდუქტები",
      seeAll: "ნახეთ ყველა...",
      allAges: "ყველა ასაკი",
      adults: "მოზრდილები",
      kids: "ბავშვები",
      ageGroup: "ასაკობრივი ჯგუფი",
    },

    // Product Details
    product: {
      ref: "Ref:",
      reviews: "შეფასებები",
      dimensions: "ნამუშევრის ზომები",
      deliveryTime: "მიწოდების ვადა",
      days: "დღე",
      tryInRoom: "მოარგე ოთახს",
      quantity: "რაოდენობა",
      details: "აღწერა",
      author: "ავტორი",
    },

    // Room Viewer
    roomViewer: {
      title: "მოარგე ოთახს",
      chooseRoom: "აირჩიე ოთახი",
      livingRoom: "მისაღები",
      bedroom: "საძინებელი",
      kitchen: "სამზარეულო",
      hall: "დერეფანი",
      artworkSize: "ნამუშევრის ზომა",
      wallColor: "კედლის ფერი",
      instructions:
        "გადაიტანეთ არჩეული პროდუქტი კედელზე სასურველ პოზიციაზე. გამოიყენეთ ზომის რეგულატორი.",
      loading: "ოთახის სურათების ჩატვირთვა...",
      artworkLoading: "პროდუქტების ჩატვირთვა...",
    },

    // Profile
    profile: {
      title: "მომხმარებლის პროფილი",
      uploadAvatar: "პროფილის სურათის ატვირთვა",
      uploading: "იტვირთება...",
      uploadSuccess: "სურათი წარმატებით აიტვირთა",
      name: "სახელი",
      email: "ელ-ფოსტა",
      newPassword: "ახალი პაროლი",
      confirmPassword: "გაიმეორეთ ახალი პაროლი",
      passwordPlaceholder: "დატოვეთ ცარიელი არსებული პაროლის შესანარჩუნებლად",
      updateProfile: "პროფილის განახლება",
      updating: "მიმდინარეობს განახლება...",
      updateSuccess: "🎉 პროფილი წარმატებით განახლდა!",
      loading: "იტვირთება...",
      updateError: "განახლება ვერ მოხერხდა",
      updateErrorDescription:
        "პროფილის განახლება ვერ მოხერხდა. გთხოვთ, სცადოთ მოგვიანებით.",
      uploadError: "ატვირთვა ვერ მოხერხდა",
      uploadErrorDescription:
        "სურათის ატვირთვა ვერ მოხერხდა. გთხოვთ, სცადოთ მოგვიანებით.",
      passwordChanged: "პაროლი შეიცვალა",
      passwordChangedDescription: "თქვენი პაროლი წარმატებით შეიცვალა.",
      updateSuccessDescription: "თქვენი პროფილი წარმატებით განახლდა.",
    },

    // Cart & Checkout
    cart: {
      yourCart: "თქვენი კალათა",
      items: "ნივთი",
      empty: "თქვენი კალათა ცარიელია",
      total: "ჯამი",
      delivery: "მიწოდება",
      free: "უფასო",
      commission: "საკომისიო",
      totalCost: "სრული ღირებულება",
      checkout: "შეკვეთის გაფორმება",
      remove: "წაშლა",
      addToCart: "კალათაში დამატება",
      adding: "ემატება...",
      outOfStock: "არ არის მარაგში",
      title: "კალათა",
    },

    // About page
    about: {
      title: "ჩვენს შესახებ",
      description:
        "SoulArt არის პლატფორმა, რომელიც აერთიანებს მხატვრებს და ხელოვნების მოყვარულებს. ჩვენი მიზანია შევქმნათ სივრცე, სადაც შეძლებთ გაყიდოთ და შეიძინოთ უნიკალური ხელოვნების ნიმუშები, შექმნათ პირადი გალერეა და გახდეთ კოლექციონერი ან მხატვარი.",
      mission: {
        title: "მისია",
        description:
          "ჩვენი მისიაა მხატვრებისთვის შევქმნათ პლატფორმა, სადაც ისინი შეძლებენ თავიანთი პროდუქტების გაზიარებას და გაყიდვას, ხოლო ხელოვნების მოყვარულებს მივაწვდინოთ უნიკალური პროდუქტები.",
      },
      goal: {
        title: "მიზანი",
        description:
          "ჩვენი მიზანია გავაერთიანოთ ხელოვნების მოყვარულები და მხატვრები ერთიან სივრცეში, სადაც ხელოვნება ყველასთვის ხელმისაწვდომი იქნება.",
      },
      vision: {
        title: "ხედვა",
        description:
          "SoulArt არის პირველი მსგავსი პლატფორმა საქართველოში, რომელიც აერთიანებს ხელოვნების სამყაროს. ჩვენი ხედვაა გავხდეთ ხელოვნების მოყვარულთა და მხატვართა მთავარი ადგილი.",
      },
      whyUs: {
        title: "რატომ SoulArt?",
        description:
          "საქართველოში მსგავსი პლატფორმა არ არსებობს. ჩვენ ვქმნით უნიკალურ შესაძლებლობას, სადაც ხელოვნება და ტექნოლოგია ერთმანეთს ხვდება.",
      },
      buyUnique: {
        title: "შეიძინეთ უნიკალური პროდუქტები",
        description:
          "ეძებთ უნიკალურ ხელოვნების ნიმუშებს? დაათვალიერეთ ჩვენი პლატფორმა და იპოვეთ პროდუქტები, რომლებიც თქვენს გემოვნებას შეესაბამება.",
        button: "დაათვალიერეთ პროდუქტები",
      },
    },

    // Seller benefits
    sellerBenefits: {
      title: "შექმენი შენი პირადი ონლაინ გალერეა Soulart-ზე",
      subtitle:
        "Soulart.ge — პირველი ქართული პლატფორმა ხელოვანებისთვის, სადაც შეგიძლიათ შექმნათ უნიკალური ონლაინ გალერეა და გაყიდოთ თქვენი პროდუქტები მარტივად და კომფორტულად. გახსენით ახალი შესაძლებლობები თქვენი პროდუქტებისთვის!",
      benefits: {
        title: "🌟 უპირატესობები ხელოვანებისთვის",
        items: [
          "სრულიად უფასო პირადი ონლაინ გალერეა ულიმიტო პროდუქტებით",
          "მარტივი რეგისტრაცია და პროდუქტების ატვირთვა",
          "პირველი თვე - 0% საკომისიო გაყიდვებზე",
          "შემდგომი პერიოდი - მხოლოდ 10% წარმატებული გაყიდვებიდან",
          "ანაზღაურების მომენტალური ჩარიცხვა მითითებულ ანგარიშზე, მას შემდეგ რაც მომხმარებელი დაადასტურებს რომ მიიღო შეკვეთა",
          "დეტალური სტატისტიკა და სრული კონტროლი თქვენს გაყიდვებზე",
          "თქვენი პროდუქტების პოპულარიზაცია ფართო აუდიტორიაში",
        ],
      },
      shipping: {
        title: "🚚 მოქნილი მიწოდების პირობები",
        items: [
          "მიწოდების ტიპს თავად ირჩევთ პროდუქტის ატვირთვისას",
          "პირადი მიწოდების შემთხვევაში - დამატებითი გადასახადი არ არის",
          "Soulart-ის კურიერის სერვისით სარგებლობისას დაემატება მხოლოდ 4% ლოჯისტიკური საკომისიო",
          "მიწოდების ვარიანტები ავტომატურად ჩანს თქვენს პანელში და მარტივად იმართება",
          "უსაფრთხო ტრანზაქციები და მყიდველებთან კომუნიკაცია პლატფორმის შიგნით",
        ],
      },
      cta: {
        text: "✨ დაიწყეთ მოგზაურობა Soulart-ზე და მიეცით თქვენს პროდუქტებს ის აუდიტორია, რომელსაც იმსახურებენ!",
        button: "დარეგისტრირდი ახლავე",
      },
    },

    // Footer
    footer: {
      copyright: "© 2025 BestSoft. ყველა უფლება დაცულია.",
      description:
        "აღმოაჩინეთ ჩვენი სახალისო კოლექცია მაისურების, ჩანთების და აქსესუარების გულის დიზაინით, რომლებიც დაჭერისას სასაცილო 'პიპ' ხმას გამოსცემენ. შეიტანეთ მხიარულება და სიურპრიზი თქვენს ყოველდღიურ სტილში!",
      quickLinks: "სწრაფი ბმულები",
      termsOfService: "მომსახურების პირობები",
      privacyPolicy: "კონფიდენციალურობის პოლიტიკა",
      contact: "კონტაქტი",
      address: "მისამართი: თბილისი, საქართველო",
      email: "ელ-ფოსტა: info@russana.ge",
      phone: "ტელეფონი: +995 XXX XXX XXX",
      socialMedia: "სოციალური ქსელები",
      follow: "მოგვყევით",
      newsletter: "სიახლეების გამოწერა",
      subscribePrompt: "გამოიწერეთ სიახლეები და მიიღეთ განახლებები",
      subscribe: "გამოწერა",
      emailPlaceholder: "შეიყვანეთ თქვენი ელფოსტა",
    },

    // Home page
    home: {
      heroTitle: "შეარჩიე ხელოვანების პროდუქტები ან გაყიდე შენი 🖌️",
      heroSubtitle:
        "პერსონალური და ხელნაკეთი პროდუქტები ქართველი ხელოვანებისგან",
    },

    // Timer translations
    timer: {
      loading: "იტვირთება...",
      message: "საიტის დასრულებამდე დარჩა",
      day: "დღე",
      days: "დღე",
      hour: "საათი",
      hours: "საათი",
      minute: "წუთი",
      minutes: "წუთი",
      second: "წამი",
      seconds: "წამი",
      month: "თვე",
    },

    // Common action buttons
    actions: {
      save: "შენახვა",
      cancel: "გაუქმება",
      edit: "რედაქტირება",
      delete: "წაშლა",
      send: "გაგზავნა",
      create: "შექმნა",
      close: "დახურვა",
      add: "დამატება",
      back: "უკან",
      next: "შემდეგი",
      submit: "გაგზავნა",
    },

    // Language selector
    language: {
      en: "ENG",
      ge: "ქარ",
    },

    // Authentication & Registration
    auth: {
      login: "შესვლა",
      register: "რეგისტრაცია",
      email: "ელ-ფოსტა",
      password: "პაროლი",
      confirmPassword: "გაიმეორეთ პაროლი",
      rememberMe: "დამიმახსოვრე",
      forgotPassword: "დაგავიწყდათ პაროლი?",
      fullName: "სრული სახელი",
      loginButton: "შესვლა",
      registerButton: "რეგისტრაცია",
      alreadyHaveAccount: "უკვე გაქვთ ანგარიში?",
      dontHaveAccount: "არ გაქვთ ანგარიში?",
      createAccount: "შექმენით ანგარიში",
      loginWelcome: "შედით თქვენი ანგარიშით",
      loginSubtitle: "კეთილი იყოს თქვენი დაბრუნება!",
      registerWelcome: "მოგესალებით ჩვენს სამყაროში!",
      registerSubtitle: "გთხოვთ, შეავსოთ რეგისტრაციის ფორმა",
      requiredField: "სავალდებულო ველი",
      invalidEmail: "არასწორი ელ-ფოსტა",
      passwordTooShort: "პაროლი უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს",
      passwordsDontMatch: "პაროლები არ ემთხვევა",
      termsAgreement: "ვეთანხმები მომსახურების პირობებს",
      personalInfo: "პირადი ინფორმაცია",
      firstName: "სახელი",
      lastName: "გვარი",
      phoneNumber: "ტელეფონის ნომერი",
      emailRequired: "ელ-ფოსტის მითითება აუცილებელია",
      enterNewPassword: "შეიყვანეთ ახალი პაროლი",
      confirmNewPassword: "დაადასტურეთ ახალი პაროლი",
      registrationSuccessful: "რეგისტრაცია წარმატებულია",
      accountCreatedSuccessfully: "ანგარიში წარმატებით შეიქმნა",
      redirectingToLogin: "მიმდინარეობს გადამისამართება შესვლის გვერდზე",
      loginSuccess: "წარმატებით შეხვედით",
      loginFailed: "შესვლა ვერ მოხერხდა",
      registrationFailed: "რეგისტრაცია ვერ მოხერხდა",
      orContinueWith: "ან გააგრძელეთ",
      forgotPasswordTitle: "განაახლეთ პაროლი",
      forgotPasswordSubtitle: "გთხოვთ, შეავსოთ პაროლის აღდგენის ფორმა",
      welcomeBack: "კეთილი იყოს თქვენი დაბრუნება!",
    },

    // Contact form
    contact: {
      title: "კონტაქტი",
      description:
        "თუ გაქვთ შეკითხვები ან გსურთ ჩვენთან დაკავშირება, გთხოვთ შეავსოთ ქვემოთ მოცემული ფორმა.",
      name: "სახელი",
      email: "ელ-ფოსტა",
      subject: "თემა",
      message: "მესიჯი",
      send: "გაგზავნა",
      nameRequired: "სახელის შეყვანა აუცილებელია",
      emailRequired: "ელ-ფოსტის შეყვანა აუცილებელია",
      subjectRequired: "თემის შეყვანა აუცილებელია",
      messageRequired: "მესიჯის შეყვანა აუცილებელია",
      namePlaceholder: "შეიყვანეთ თქვენი სახელი",
      emailPlaceholder: "შეიყვანეთ თქვენი ელ-ფოსტა",
      subjectPlaceholder: "შეიყვანეთ თემა",
      messagePlaceholder: "შეიყვანეთ თქვენი შეტყობინება",
    },

    // Art Categories
    categories: {
      // Main categories
      paintings: "ნახატები",
      handmade: "ხელნაკეთი ნივთები",
      clothing: "ტანსაცმელი",
      accessories: "აქსესუარები",
      footwear: "ფეხსაცმელი",
      swimwear: "საცურაო კოსტუმები",

      // Painting subcategories
      oil: "ზეთი",
      acrylic: "აკრილი",
      watercolor: "აკვარელი",
      pastel: "პასტელი",
      drawing: "ნახატი",
      mixedMedia: "შერეული მედია",
      abstract: "აბსტრაქცია",
      landscape: "პეიზაჟი",
      portrait: "პორტრეტი",
      stillLife: "ნატურმორტი",
      contemporary: "თანამედროვე",
      modern: "მოდერნი",
      impressionism: "იმპრესიონიზმი",
      expressionism: "ექსპრესიონიზმი",
      realism: "რეალიზმი",
      surrealism: "სიურეალიზმი",
      digital: "ციფრული",
      blackAndWhite: "შავ-თეთრი",
      animation: "ანიმაციური",
      digitalIllustrations: "ციფრული ილუსტრაციები",
      other: "სხვა",

      // Handmade subcategories
      pottery: "კერამიკა",
      woodwork: "ხის ნაკეთობები",
      jewelry: "სამკაულები",
      textile: "ტექსტილი",
      glasswork: "მინის ნაკეთობები",
      sculpture: "სკულპტურა",
      enamel: "მინანქარი",
      sculptures: "სკულპტურები",
      otherHandmade: "სხვა",

      // Clothing subcategories
      tshirts: "მაისურები",
      dresses: "კაბები",
      hoodies: "ჰუდები",

      // Accessories subcategories
      caps: "კეპები",
      hats: "პანამები",

      // Footwear subcategories
      sporty: "სპორტული",
      casual: "ყოველდღიური",

      // Swimwear subcategories
      swimsuits: "საცურაო კოსტუმები",
    },

    // Forum
    forum: {
      addNewPost: "➕ ახალი პოსტის დამატება",
      loadingMore: "იტვირთება მეტი...",
      addPostSeeOthers: "დაამატე პოსტი / ნახე სხვა პოსტებიც",
      edit: "რედაქტირება",
      delete: "წაშლა",
      save: "შენახვა",
      cancel: "გაუქმება",
      reply: "პასუხი",
      like: "მოწონება",
      unlike: "მოწონების გაუქმება",
      writeReply: "დაწერეთ პასუხი...",
      writeComment: "დაწერეთ კომენტარი...",
      posting: "იგზავნება...",
      send: "გაგზავნა",
      selectTag: "აირჩიეთ თეგი",
      creating: "იქმნება...",
      create: "შექმნა",
      newPost: "ახალი პოსტის შექმნა",
      writePostContent: "დაწერეთ პოსტის შინაარსი...",
      tags: {
        handmade: "ხელნაკეთი ნივთები",
        paintings: "ნახატები",
        other: "სხვა",
      },
    },

    // Categories translations
    productCategories: {
      // Painting subcategories
      პეიზაჟი: "პეიზაჟი",
      პორტრეტი: "პორტრეტი",
      აბსტრაქცია: "აბსტრაქცია",
      "შავ-თეთრი": "შავ-თეთრი",
      ანიმაციური: "ანიმაციური",
      "ციფრული ილუსტრაციები": "ციფრული ილუსტრაციები",
      მინიატურა: "მინიატურა",
      სხვა: "სხვა",

      // Handmade subcategories
      კერამიკა: "კერამიკა",
      "ხის ნაკეთობები": "ხის ნაკეთობები",
      სამკაულები: "სამკაულები",
      ტექსტილი: "ტექსტილი",
      მინანქარი: "მინანქარი",
      სკულპტურები: "სკულპტურები",

      // Clothing subcategories
      მაისურები: "მაისურები",
      კაბები: "კაბები",
      ჰუდები: "ჰუდები",

      // Accessories subcategories
      კეპები: "კეპები",
      პანამები: "პანამები",

      // Footwear subcategories
      სპორტული: "სპორტული",
      ყოველდღიური: "ყოველდღიური",

      // Swimwear subcategories
      "საცურაო კოსტუმები": "საცურაო კოსტუმები",
    },
  },

  en: {
    // Navigation
    navigation: {
      home: "Home",
      shop: "Shop Artwork",
      auction: "Auction",
      myOrders: "My Orders",
      forum: "Forum",
      about: "About",
      login: "Login",
      profile: "Profile",
      orders: "Orders",
      adminPanel: "Admin Panel",
      products: "Products",
      users: "Users",
      logout: "Logout",
    },

    // Shop
    shop: {
      allArtworks: "All Artworks",
      artistWorks: "'s Artworks",
      loading: "Loading...",
      filters: "Filters",
      sort: "Sort",
      categories: "Categories",
      painters: "Artists",
      priceRange: "Price Range",
      inStock: "In Stock",
      outOfStock: "Out of Stock",
      mainCategory: "Main Category",
      searchPainter: "Search Artist",
      authorCompany: "Author/Company",
      searchAuthorCompany: "Search author/company",
      defaultSort: "Default",
      priceLowToHigh: "Price: Low to High",
      priceHighToLow: "Price: High to Low",
      emptyDescription: "Browse our platform to find unique artworks",
      seeAll: "See All...",
      allAges: "All Ages",
      adults: "Adults",
      kids: "Kids",
      ageGroup: "Age Group",
    },

    // Product Details
    product: {
      ref: "Ref:",
      reviews: "Reviews",
      dimensions: "Artwork Dimensions",

      deliveryTime: "Delivery Time",
      days: "Days",
      tryInRoom: "Try in Room",
      quantity: "Quantity",
      details: "Description",
      author: "Author",
    },

    // Room Viewer
    roomViewer: {
      title: "Try in Room",
      chooseRoom: "Choose Room",
      livingRoom: "Living Room",
      bedroom: "Bedroom",
      kitchen: "Kitchen",
      hall: "Hall",
      artworkSize: "Artwork Size",
      wallColor: "Wall Color",
      instructions:
        "Drag the selected product to the desired position on the wall. Use the size regulator.",
      loading: "Loading room images...",
      artworkLoading: "Loading artwork...",
    },

    // Profile
    profile: {
      title: "User Profile",
      uploadAvatar: "Upload Profile Picture",
      uploading: "Uploading...",
      uploadSuccess: "Image uploaded successfully",
      name: "Name",
      email: "Email",
      newPassword: "New Password",
      confirmPassword: "Confirm New Password",
      passwordPlaceholder: "Leave empty to keep current password",
      updateProfile: "Update Profile",
      updating: "Updating...",
      updateSuccess: "🎉 Profile updated successfully!",
      loading: "Loading...",
      updateError: "Update Error",
      updateErrorDescription:
        "Failed to update profile. Please try again later.",
      uploadError: "Upload Error",
      uploadErrorDescription: "Failed to upload image. Please try again later.",
      passwordChanged: "Password Changed",
      passwordChangedDescription:
        "Your password has been changed successfully.",
      updateSuccessDescription: "Your profile has been updated successfully.",
    },

    // Cart & Checkout
    cart: {
      yourCart: "Your Cart",
      items: "items",
      empty: "Your cart is empty",
      total: "Subtotal",
      delivery: "Delivery",
      free: "Free",
      commission: "Fee",
      totalCost: "Total",
      checkout: "Checkout",
      remove: "Remove",
      addToCart: "Add to Cart",
      adding: "Adding...",
      outOfStock: "Out of Stock",
      title: "Shopping Cart",
    },

    // About page
    about: {
      title: "About Us",
      description:
        "SoulArt is a platform that brings artists and art lovers together. Our goal is to create a space where you can sell and buy unique pieces of art, create your personal gallery, and become a collector or artist.",
      mission: {
        title: "Mission",
        description:
          "Our mission is to create a platform for artists where they can share and sell their work, and to provide art lovers with unique artworks.",
      },
      goal: {
        title: "Goal",
        description:
          "Our goal is to unite art lovers and artists in a single space where art is accessible to everyone.",
      },
      vision: {
        title: "Vision",
        description:
          "SoulArt is the first such platform in Georgia that unites the art world. Our vision is to become the primary destination for art lovers and artists.",
      },
      whyUs: {
        title: "Why SoulArt?",
        description:
          "There is no similar platform in Georgia. We create a unique opportunity where art and technology meet.",
      },
      buyUnique: {
        title: "Buy Unique Artworks",
        description:
          "Looking for unique art pieces? Browse our platform and find artwork that matches your taste.",
        button: "Browse Artworks",
      },
    },

    // Footer
    footer: {
      copyright: "© 2025 BestSoft. All rights reserved.",
      description:
        "Explore our playful collection of t-shirts, bags, and accessories with squeaky heart designs that make a fun 'pip' sound when pressed. Add some joy and surprise to your everyday outfits!",
      quickLinks: "Quick Links",
      termsOfService: "Terms of Service",
      privacyPolicy: "Privacy Policy",
      contact: "Contact",
      address: "Address: Tbilisi, Georgia",
      email: "Email: info@russana.ge",
      phone: "Phone: +995 XXX XXX XXX",
      socialMedia: "Social Media",
      follow: "Follow us",
      newsletter: "Newsletter",
      subscribePrompt: "Subscribe to our newsletter for updates",
      subscribe: "Subscribe",
      emailPlaceholder: "Enter your email",
    },

    // Home page
    home: {
      heroTitle: "Discover artworks by artists or sell your own 🖌️",
      heroSubtitle: "Personalized and handmade creations by Georgian artists",
    },

    // Timer translations
    timer: {
      loading: "Loading...",
      message: "Time left until website ends",
      day: "Day",
      days: "Days",
      hour: "Hour",
      hours: "Hours",
      minute: "Minute",
      minutes: "Minutes",
      second: "Second",
      seconds: "Seconds",
      month: "Month",
    },

    // Common action buttons
    actions: {
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      send: "Send",
      create: "Create",
      close: "Close",
      add: "Add",
      back: "Back",
      next: "Next",
      submit: "Submit",
    },

    // Language selector
    language: {
      en: "ENG",
      ge: "GEO",
    },

    // Authentication & Registration
    auth: {
      login: "Login",
      register: "Register",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      rememberMe: "Remember me",
      forgotPassword: "Forgot password?",
      fullName: "Full Name",
      loginButton: "Login",
      registerButton: "Register",
      alreadyHaveAccount: "Already have an account?",
      dontHaveAccount: "Don't have an account?",
      createAccount: "Create Account",
      loginWelcome: "Sign into your account",
      loginSubtitle: "Welcome back!",
      registerWelcome: "Welcome to Our World!",
      registerSubtitle: "Please fill in the registration form",
      requiredField: "This field is required",
      invalidEmail: "Invalid email address",
      passwordTooShort: "Password must be at least 6 characters",
      passwordsDontMatch: "Passwords don't match",
      termsAgreement: "I agree to the Terms of Service",
      personalInfo: "Personal Information",
      firstName: "First Name",
      lastName: "Last Name",
      phoneNumber: "Phone Number",
      emailRequired: "Email is required",
      enterNewPassword: "Enter new password",
      confirmNewPassword: "Confirm new password",
      registrationSuccessful: "Registration Successful",
      accountCreatedSuccessfully: "Account created successfully",
      redirectingToLogin: "Redirecting to login page",
      loginSuccess: "Login Successful",
      loginFailed: "Login Failed",
      registrationFailed: "Registration Failed",
      orContinueWith: "or continue with",
      forgotPasswordTitle: "Reset Your Password",
      forgotPasswordSubtitle: "Please fill in the password recovery form",
      welcomeBack: "Welcome back!",
    },

    // Contact form
    contact: {
      title: "Contact",
      description:
        "If you have questions or would like to get in touch, please fill out the form below.",
      name: "Name",
      email: "Email",
      subject: "Subject",
      message: "Message",
      send: "Send",
      nameRequired: "Name is required",
      emailRequired: "Email is required",
      subjectRequired: "Subject is required",
      messageRequired: "Message is required",
      namePlaceholder: "Enter your name",
      emailPlaceholder: "Enter your email",
      subjectPlaceholder: "Enter subject",
      messagePlaceholder: "Enter your message",
    },

    // Art Categories
    categories: {
      // Main categories
      paintings: "Paintings",
      handmade: "Handmade",
      clothing: "Clothing",
      accessories: "Accessories",
      footwear: "Footwear",
      swimwear: "Swimwear",

      // Painting subcategories
      oil: "Oil",
      acrylic: "Acrylic",
      watercolor: "Watercolor",
      pastel: "Pastel",
      drawing: "Drawing",
      mixedMedia: "Mixed Media",
      abstract: "Abstract",
      landscape: "Landscape",
      portrait: "Portrait",
      stillLife: "Still Life",
      contemporary: "Contemporary",
      modern: "Modern",
      impressionism: "Impressionism",
      expressionism: "Expressionism",
      realism: "Realism",
      surrealism: "Surrealism",
      digital: "Digital",
      blackAndWhite: "Black & White",
      animation: "Animation",
      digitalIllustrations: "Digital Illustrations",
      other: "Other",

      // Handmade subcategories
      pottery: "Pottery",
      woodwork: "Woodwork",
      jewelry: "Jewelry",
      textile: "Textile",
      glasswork: "Glasswork",
      sculpture: "Sculpture",
      enamel: "Enamel",
      sculptures: "Sculptures",
      otherHandmade: "Other",

      // Clothing subcategories
      tshirts: "T-shirts",
      dresses: "Dresses",
      hoodies: "Hoodies",

      // Accessories subcategories
      caps: "Caps",
      hats: "Hats",

      // Footwear subcategories
      sporty: "Sporty",
      casual: "Casual",

      // Swimwear subcategories
      swimsuits: "Swimsuits",
    },

    // Forum
    forum: {
      addNewPost: "➕ Add new post",
      loadingMore: "Loading more...",
      addPostSeeOthers: "Add post / See other posts",
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel",
      reply: "Reply",
      like: "Like",
      unlike: "Unlike",
      writeReply: "Write a reply...",
      writeComment: "Write a comment...",
      posting: "Posting...",
      send: "Send",
      selectTag: "Select a tag",
      creating: "Creating...",
      create: "Create",
      newPost: "Create New Post",
      writePostContent: "Write your post content...",
      tags: {
        handmade: "Handmade Items",
        paintings: "Paintings",
        other: "Other",
      },
    },

    // Categories translations
    productCategories: {
      // Painting subcategories
      პეიზაჟი: "Landscape",
      პორტრეტი: "Portrait",
      აბსტრაქცია: "Abstract",
      "შავ-თეთრი": "Black & White",
      ანიმაციური: "Animation",
      "ციფრული ილუსტრაციები": "Digital Illustrations",
      მინიატურა: "Miniature",
      სხვა: "Other",

      // Handmade subcategories
      კერამიკა: "Pottery",
      "ხის ნაკეთობები": "Woodwork",
      სამკაულები: "Jewelry",
      ტექსტილი: "Textile",
      მინანქარი: "Enamel",
      სკულპტურები: "Sculptures",

      // Clothing subcategories
      მაისურები: "T-shirts",
      კაბები: "Dresses",
      ჰუდები: "Hoodies",

      // Accessories subcategories
      კეპები: "Caps",
      პანამები: "Hats",

      // Footwear subcategories
      სპორტული: "Sporty",
      ყოველდღიური: "Casual",

      // Swimwear subcategories
      "საცურაო კოსტუმები": "Swimsuits",
    },
  },
};
