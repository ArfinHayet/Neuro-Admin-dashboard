//assessments
export const initialQuestions = [
  { id: 1, question: "I often notice small sounds when others do not." },
  {
    id: 2,
    question:
      "I usually concentrate more on the whole picture, rather than the small details.",
  },
  { id: 3, question: "I find it easy to do more than one thing at once." },
  {
    id: 4,
    question:
      "If there is an interruption, I can switch back to what I was doing very quickly.",
  },
  {
    id: 5,
    question:
      "I find it easy to ‘read between the lines’ when someone is talking to me.",
  },
  {
    id: 6,
    question: "I know how to tell if someone listening to me is getting bored",
  },
  {
    id: 7,
    question:
      "When I’m reading a story I find it difficult to work out the characters’ intentions.",
  },
  {
    id: 8,
    question:
      "I like to collect information about categories of things (e.g. types of car, bird, train, plant etc.).",
  },
  {
    id: 9,
    question:
      "I find it easy to work out what someone is thinking or feeling just by looking at their face.",
  },
  { id: 10, question: "I find it difficult to work out people’s intentions." },
];

export const onDemandAssessments = [
  {
    id: 1,
    name: "Child Autism Diagnosis",
    description: "Assess characteristics related to autism spectrum.",
    time: "15 min",
    image: "/public/png/autism.svg",
    questions: [
      { id: 1, question: "Does the child avoid eye contact?" },
      {
        id: 2,
        question: "Does the child have difficulty with social interactions?",
      },
      { id: 3, question: "Does the child show repetitive behaviors?" },
      {
        id: 4,
        question: "Does the child have unusual reactions to sensory stimuli?",
      },
      {
        id: 5,
        question: "Does the child have trouble understanding others' feelings?",
      },
      { id: 6, question: "Does the child have delayed speech development?" },
      { id: 7, question: "Does the child engage in imaginative play?" },
      { id: 8, question: "Does the child prefer routines and dislike change?" },
      {
        id: 9,
        question: "Does the child exhibit hyperactivity or impulsiveness?",
      },
      { id: 10, question: "Does the child have difficulty making friends?" },
    ],
  },
  {
    id: 2,
    name: "Child Sensory Processing",
    description: "Evaluate how the child processes sensory inputs.",
    time: "12 min",
    image: "/public/png/autism.svg",
    questions: [
      { id: 1, question: "Is the child overly sensitive to sounds?" },
      { id: 2, question: "Does the child dislike certain textures?" },
      { id: 3, question: "Does the child avoid bright lights?" },
      {
        id: 4,
        question:
          "Does the child have difficulty with balance or coordination?",
      },
      {
        id: 5,
        question: "Does the child frequently seek intense sensory input?",
      },
      {
        id: 6,
        question: "Does the child have unusual eating or sleeping patterns?",
      },
      { id: 7, question: "Does the child get upset by certain smells?" },
      { id: 8, question: "Does the child avoid physical touch?" },
      { id: 9, question: "Does the child have trouble sitting still?" },
      {
        id: 10,
        question: "Does the child enjoy activities involving movement?",
      },
    ],
  },
  {
    id: 3,
    name: "Social Interaction",
    description: "Assess the child’s social skills and interaction.",
    time: "10 min",
    image: "/public/png/autism.svg",
    questions: [
      { id: 1, question: "Does the child initiate conversations?" },
      { id: 2, question: "Does the child understand social cues?" },
      { id: 3, question: "Does the child prefer to play alone?" },
      { id: 4, question: "Does the child show empathy to others?" },
      { id: 5, question: "Does the child follow social rules?" },
      {
        id: 6,
        question: "Does the child maintain eye contact during conversations?",
      },
      { id: 7, question: "Does the child respond appropriately to emotions?" },
      {
        id: 8,
        question: "Does the child share toys or activities with others?",
      },
      { id: 9, question: "Does the child make friends easily?" },
      { id: 10, question: "Does the child engage in group activities?" },
    ],
  },
  {
    id: 4,
    name: "Behavioral Assessment",
    description: "Evaluate child’s behavioral patterns and challenges.",
    time: "14 min",
    image: "/public/png/autism.svg",
    questions: [
      { id: 1, question: "Does the child have frequent mood swings?" },
      { id: 2, question: "Does the child show aggressive behavior?" },
      { id: 3, question: "Does the child follow routines?" },
      { id: 4, question: "Does the child have trouble with impulse control?" },
      { id: 5, question: "Does the child exhibit anxiety or fears?" },
      { id: 6, question: "Does the child have difficulty calming down?" },
      { id: 7, question: "Does the child have tantrums?" },
      { id: 8, question: "Does the child respond well to discipline?" },
      { id: 9, question: "Does the child show hyperactivity?" },
      { id: 10, question: "Does the child display compulsive behaviors?" },
    ],
  },
];

export const categories = [
  { id: 1, title: "Behavioral", chartData: {} },
  { id: 2, title: "Cognitive", chartData: {} },
  { id: 3, title: "Emotional", chartData: {} },
  { id: 4, title: "Motor", chartData: {} },
  { id: 5, title: "Communication", chartData: {} },
  { id: 6, title: "Sensory", chartData: {} },
];

//clinicians
export const clinicians = [
  {
    id: 1,
    name: "Dr. Sarah Smith",
    title: "Clinical Psychologist",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    email: "sarah.smith@example.com",
    phone: "704 783 23",
    status: "active",
    casesTaken: 42,
    casesCompleted: 38,
    totalEarnings: 12300,
    pendingAmount: 1500,
    joinedDate: "2025-07-29",
    specialties: ["Cognitive Therapy", "Child Psychology"],
    bio: "Experienced clinical psychologist focused on child and adolescent mental health.",
    registrationInfo: "Registered with XYZ Medical Board",
  },
  {
    id: 2,
    name: "Dr. John Doe",
    title: "Therapist",
    image: "https://randomuser.me/api/portraits/men/44.jpg",
    email: "sarah.smith@example.com",
    phone: "704 783 23",
    status: "inactive",
    casesTaken: 21,
    casesCompleted: 20,
    totalEarnings: 7600,
    pendingAmount: 1500,
    joinedDate: "2025-07-28",
    specialties: ["Behavioral Therapy"],
    bio: "Therapist with 10 years of experience in behavioral therapy.",
    registrationInfo: "Registered with ABC Medical Board",
  },
  {
    id: 3,
    name: "Dr. Emily White",
    title: "Child Psychiatrist",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
    email: "sarah.smith@example.com",
    phone: "704 783 23",
    status: "active",
    casesTaken: 10,
    casesCompleted: 8,
    totalEarnings: 5400,
    pendingAmount: 600,
    joinedDate: "2025-07-30",
    specialties: ["Child Psychiatry", "Behavioral Therapy"],
    bio: "Passionate child psychiatrist with 7 years of experience.",
    registrationInfo: "Registered with DEF Medical Board",
    createdAt: "2025-07-20T09:00:00Z",
  },
  {
    id: 4,
    name: "Dr. Mark Black",
    title: "Neuropsychologist",
    image: "https://randomuser.me/api/portraits/men/55.jpg",
    email: "sarah.smith@example.com",
    phone: "704 783 23",
    status: "active",
    casesTaken: 5,
    casesCompleted: 4,
    totalEarnings: 3000,
    pendingAmount: 400,
    joinedDate: "2025-05-15",
    specialties: ["Neuropsychology"],
    bio: "Experienced neuropsychologist focusing on adult cases.",
    registrationInfo: "Registered with GHI Medical Board",
    createdAt: "2025-08-10T11:00:00Z",
  },
];

export const clinicianAssessments = {
  1: [
    {
      id: 1,
      assessmentName: "Speech Assessment",
      patientName: "Alice",
      dateTaken: "2025-07-25",
    },
    {
      id: 2,
      assessmentName: "Motor Skills Assessment",
      patientName: "Bob",
      dateTaken: "2025-07-30",
    },
  ],
  2: [
    {
      id: 3,
      assessmentName: "Cognitive Skills",
      patientName: "Charlie",
      dateTaken: "2025-07-26",
    },
  ],
};

export const clinicianLeaves = {
  1: [
    {
      id: 101,
      start: "2025-09-01",
      end: "2025-09-05",
      reason: "Family emergency",
      status: "Pending",
    },
    {
      id: 201,
      start: "2025-08-15",
      end: "2025-08-20",
      reason: "Medical Emergency",
      status: "Pending",
    },
    {
      id: 202,
      start: "2025-09-10",
      end: "2025-09-12",
      reason: "N/A",
      status: "Approved",
    },
  ],
  2: [],
};

//blog

export const dummyblogs = [
  {
    id: 1,
    title: "Understanding Mental Wellness",
    content:
      "Mental wellness is more than just the absence of mental illness. It includes emotional well-being, the ability to manage stress, and maintaining healthy relationships...",
    image: "/public/png/blog-img.jpg",
  },
  {
    id: 2,
    title: "Mindfulness Techniques for Beginners",
    content:
      "Mindfulness involves paying attention to the present moment without judgment. It can be practiced through meditation, breathing exercises, and everyday awareness...",
    image: "./public/png/blog-img.jpg",
  },
];

// Your existing users and children arrays (unchanged)
export const users = [
  {
    id: 1,
    role: "Patient",
    name: "John Doe",
    image: "./public/png/patient-img.png",
    email: "john@example.com",
    phone: "1234567890",
    country: "USA",
    state: "California",
    street: "123 Main St",
    postCode: "90001",
    age: 30,
    isBlocked: false,
  },
  {
    id: 2,
    role: "Guardian",
    name: "Jane Smith",
    image: "./public/png/patient-img.png",
    email: "jane@example.com",
    phone: "0987654321",
    country: "USA",
    state: "New York",
    street: "456 Park Ave",
    postCode: "10022",
    age: 45,
    isBlocked: false,
  },
  {
    id: 3,
    role: "Carer",
    name: "Mark Johnson",
    image: "./public/png/patient-img.png",
    email: "mark@example.com",
    phone: "5555555555",
    country: "USA",
    state: "Texas",
    street: "789 Elm St",
    postCode: "75001",
    age: 38,
    isBlocked: true,
  },
  {
    id: 4,
    role: "Patient",
    name: "Alice Brown",
    image: "./public/png/patient-img.png",
    email: "alice@example.com",
    phone: "1112223333",
    country: "USA",
    state: "Florida",
    street: "789 Oak St",
    postCode: "32004",
    age: 28,
    isBlocked: false,
    createdAt: "2025-07-25T10:30:00Z", // within 30 days
  },
  {
    id: 5,
    role: "Guardian",
    name: "Michael Green",
    image: "./public/png/patient-img.png",
    email: "michael@example.com",
    phone: "4445556666",
    country: "USA",
    state: "Nevada",
    street: "123 Pine St",
    postCode: "89012",
    age: 50,
    isBlocked: false,
    createdAt: "2025-08-10T15:45:00Z", // older than 30 days
  },
];

export const children = [
  {
    id: "c1",
    userId: 1, // linked to John Doe
    name: "Child One",
    age: 8,
    diagnosis: "Child Autism",
  },
  {
    id: "c2",
    userId: 1, // linked to John Doe
    name: "Child Two",
    age: 8,
    diagnosis: "ADHD",
  },
  {
    id: "c3",
    userId: 2, // linked to Jane Smith
    name: "Child One",
    age: 10,
    diagnosis: "Autism Spectrum Disorder",
  },
  {
    id: "c4",
    userId: 2, // linked to Jane Smith
    name: "Child One",
    age: 6,
    diagnosis: "Dyslexia",
  },
];

// Added assessments array
export const assessments = [
  {
    id: 201,
    userId: 1,
    childId: "c1",
    name: "Child Autism Diagnosis",
    categoryId: 1,
    dateTaken: "2025-08-10",
    type: "on-demand",
    answers: [
      { questionId: 1, answer: "No" },
      {
        questionId: 2,
        question: "Does the child have difficulty with social interactions?",
        answer: "Yes",
      },
      {
        questionId: 3,
        question: "Does the child show repetitive behaviors?",
        answer: "No",
      },
      {
        questionId: 4,
        question: "Does the child have unusual reactions to sensory stimuli?",
        answer: "No",
      },
      {
        questionId: 5,
        question: "Does the child have trouble understanding others' feelings?",
        answer: "Yes",
      },
      {
        questionId: 6,
        question: "Does the child have delayed speech development?",
        answer: "No",
      },
      {
        questionId: 7,
        question: "Does the child engage in imaginative play?",
        answer: "Yes",
      },
      {
        questionId: 8,
        question: "Does the child prefer routines and dislike change?",
        answer: "No",
      },
      {
        questionId: 9,
        question: "Does the child exhibit hyperactivity or impulsiveness?",
        answer: "Yes",
      },
      {
        questionId: 10,
        question: "Does the child have difficulty making friends?",
        answer: "No",
      },
    ],
  },
  {
    id: 202,
    userId: 2,
    childId: "c3",
    name: "Social Interaction",
    categoryId: 2,
    dateTaken: "2025-08-11",
    type: "on-demand",
    answers: [
      { questionId: 1, answer: "No" },
      {
        questionId: 2,
        question: "Does the child have difficulty with social interactions?",
        answer: "Yes",
      },
      {
        questionId: 3,
        question: "Does the child show repetitive behaviors?",
        answer: "No",
      },
      {
        questionId: 4,
        question: "Does the child have unusual reactions to sensory stimuli?",
        answer: "No",
      },
      {
        questionId: 5,
        question: "Does the child have trouble understanding others' feelings?",
        answer: "Yes",
      },
      {
        questionId: 6,
        question: "Does the child have delayed speech development?",
        answer: "No",
      },
      {
        questionId: 7,
        question: "Does the child engage in imaginative play?",
        answer: "Yes",
      },
      {
        questionId: 8,
        question: "Does the child prefer routines and dislike change?",
        answer: "No",
      },
      {
        questionId: 9,
        question: "Does the child exhibit hyperactivity or impulsiveness?",
        answer: "Yes",
      },
      {
        questionId: 10,
        question: "Does the child have difficulty making friends?",
        answer: "No",
      },
    ],
  },
  {
    id: 203,
    userId: 1,
    childId: "c2",
    name: "Motor Skills",
    categoryId: 3,
    dateTaken: "2025-08-12",
    type: "on-demand",
    answers: [
      { questionId: 1, answer: "No" },
      {
        questionId: 2,
        question: "Does the child have difficulty with social interactions?",
        answer: "Yes",
      },
      {
        questionId: 3,
        question: "Does the child show repetitive behaviors?",
        answer: "No",
      },
      {
        questionId: 4,
        question: "Does the child have unusual reactions to sensory stimuli?",
        answer: "No",
      },
      {
        questionId: 5,
        question: "Does the child have trouble understanding others' feelings?",
        answer: "Yes",
      },
      {
        questionId: 6,
        question: "Does the child have delayed speech development?",
        answer: "No",
      },
      {
        questionId: 7,
        question: "Does the child engage in imaginative play?",
        answer: "Yes",
      },
      {
        questionId: 8,
        question: "Does the child prefer routines and dislike change?",
        answer: "No",
      },
      {
        questionId: 9,
        question: "Does the child exhibit hyperactivity or impulsiveness?",
        answer: "Yes",
      },
      {
        questionId: 10,
        question: "Does the child have difficulty making friends?",
        answer: "No",
      },
    ],
  },
  {
    id: 101,
    userId: 1,
    childId: "c1",
    name: "Initial Autism Screening",
    categoryId: 1,
    dateTaken: "2025-08-01",
    type: "initial",
    answers: [
      { questionId: 1, answer: "No" },
      {
        questionId: 2,
        question: "Does the child have difficulty with social interactions?",
        answer: "Yes",
      },
      {
        questionId: 3,
        question: "Does the child show repetitive behaviors?",
        answer: "No",
      },
      {
        questionId: 4,
        question: "Does the child have unusual reactions to sensory stimuli?",
        answer: "No",
      },
      {
        questionId: 5,
        question: "Does the child have trouble understanding others' feelings?",
        answer: "Yes",
      },
      {
        questionId: 6,
        question: "Does the child have delayed speech development?",
        answer: "No",
      },
      {
        questionId: 7,
        question: "Does the child engage in imaginative play?",
        answer: "Yes",
      },
      {
        questionId: 8,
        question: "Does the child prefer routines and dislike change?",
        answer: "No",
      },
      {
        questionId: 9,
        question: "Does the child exhibit hyperactivity or impulsiveness?",
        answer: "Yes",
      },
      {
        questionId: 10,
        question: "Does the child have difficulty making friends?",
        answer: "No",
      },
    ],
  },
  {
    id: 102,
    userId: 2,
    childId: "c2",
    name: "Initial Sensory Screening",
    categoryId: 2,
    dateTaken: "2025-08-05",
    type: "initial",
    answers: [
      { questionId: 1, answer: "No" },
      { questionId: 2, answer: "Yes" },
      { questionId: 3, answer: "No" },
      { questionId: 4, answer: "No" },
      { questionId: 5, answer: "Yes" },
      { questionId: 6, answer: "No" },
      { questionId: 7, answer: "Yes" },
      { questionId: 8, answer: "No" },
      { questionId: 9, answer: "Yes" },
      { questionId: 10, answer: "No" },
    ],
  },
];

// Clinician approval requests
export const clinicianRequests = [
  {
    id: 1,
    name: "Dr. Alice Johnson",
    specialties: ["Psychology", "Neuropsychology"],
    requestedOn: "2025-07-20",
  },
  {
    id: 2,
    name: "Dr. Bob Martin",
    specialties: ["Psychiatry"],
    requestedOn: "2025-07-22",
  },
];

export const assessmentCategories = [
  { id: 1, name: "Speech Assessment", price: 50, enabled: true },
  { id: 2, name: "Motor Skills Assessment", price: 60, enabled: false },
  { id: 3, name: "Child Autism Diagnosis", price: 80, enabled: true },
  { id: 4, name: "Child Sensory Processing", price: 60, enabled: false },
  { id: 5, name: "Language Development", price: 60, enabled: false },
  { id: 6, name: "Behavioral Assessment", price: 60, enabled: false },
];

export const clinicianList = [
  { id: 1, name: "Dr. Smith", commission: 25 },
  { id: 2, name: "Dr. Johnson", commission: 20 },
];

export const defaultCommissionRate = 20;

// Initial invoices / transaction logs
export const transactionLogs = [
  {
    id: 1,
    date: "2025-07-10",
    clinician: "Dr. John Doe",
    amount: 500,
    clinicianShare: 350,
    platformShare: 150,
    invoice: 1,
    status: "paid",
  },
  {
    id: 2,
    date: "2025-07-15",
    clinician: "Dr. Sarah Smith",
    amount: 600,
    clinicianShare: 400,
    platformShare: 200,
    invoice: 2,
    status: "paid",
  },
];

const mockPurchases = [
  {
    id: 1,
    userName: "John Doe",
    userEmail: "john@example.com",
    patientName: "Emily Doe",
    assessmentName: "Autism Diagnostic Test",
    paymentIntentId: "pi_3Nv12345",
    amount: 5000, // Stripe stores in cents
    currency: "GBP",
    status: "succeeded",
    paymentMethod: "card",
    createdAt: "2025-08-20T12:45:00Z",
    receiptUrl: "https://pay.stripe.com/receipts/123",
  },
  {
    id: 2,
    userName: "Sarah Lee",
    userEmail: "sarah@example.com",
    patientName: "Michael Lee",
    assessmentName: "ADHD Screening",
    paymentIntentId: "pi_3Nv67890",
    amount: 3000,
    currency: "GBP",
    status: "succeeded",
    paymentMethod: "apple_pay",
    createdAt: "2025-08-22T15:30:00Z",
    receiptUrl: "https://pay.stripe.com/receipts/456",
  },
];
