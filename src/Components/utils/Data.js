

//assessments
export const initialQuestions = [
  { id: 1, question: "I often notice small sounds when others do not." },
  { id: 2, question: "I usually concentrate more on the whole picture, rather than the small details." },
  { id: 3, question: "I find it easy to do more than one thing at once." },
  { id: 4, question: "If there is an interruption, I can switch back to what I was doing very quickly." },
  { id: 5, question: "I find it easy to ‘read between the lines’ when someone is talking to me." },
  { id: 6, question: "I know how to tell if someone listening to me is getting bored" },
  { id: 7, question: "When I’m reading a story I find it difficult to work out the characters’ intentions." },
  { id: 8, question: "I like to collect information about categories of things (e.g. types of car, bird, train, plant etc.)." },
  { id: 9, question: "I find it easy to work out what someone is thinking or feeling just by looking at their face." },
  { id: 10, question: "I find it difficult to work out people’s intentions." },
];


export const onDemandAssessments = [
  {
    id: 1,
    title: "Cognitive Assessment",
    description: "Evaluate attention, memory, and problem-solving skills.",
    time: "10 min",
    image: "/public/png/autism.svg",
    bgColor: "#E4E4E4",
    questions: [
      "What is your name?",
      "Can you remember this number?",
      "What day is it today?",
      "Repeat these words after me.",
      "Count backwards from 100 by sevens.",
      "Name as many animals as you can in a minute.",
      "What’s the capital of France?",
      "How do you make a cup of tea?",
      "What’s 7 x 8?",
      "Describe how to get to the grocery store.",
    ],
  },
  {
    id: 2,
    title: "Mood Assessment",
    description: "Understand emotional state and mood swings.",
    time: "8 min",
    image: "/public/png/autism.svg",
    bgColor: "#E4E4E4",
    questions: [
      "How have you been feeling lately?",
      "Do you feel hopeful about the future?",
      "Have you experienced mood swings recently?",
      "Do you find it hard to sleep?",
      "Are you eating regularly?",
      "Do you enjoy activities you used to?",
      "Do you feel anxious or stressed often?",
      "Have you felt worthless or guilty?",
      "Are you easily irritated?",
      "Do you cry more than usual?",
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
    status: "active",
    casesTaken: 42,
    casesCompleted: 38,
    totalEarnings: 12300,
    pendingAmount: 1500,
    joinedDate: "2025-07-29",
  },
  {
    id: 2,
    name: "Dr. John Doe",
    title: "Therapist",
    image: "https://randomuser.me/api/portraits/men/44.jpg",
    status: "inactive",
    casesTaken: 21,
    casesCompleted: 20,
    totalEarnings: 7600,
    pendingAmount: 1500,
    joinedDate: "2025-07-28",
  },
];

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


// Users array
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
];

// Children array
export const children = [
  {
    id: "c1",
    userId: 1, // linked to John Doe
    name: "Child One",
    age: 8,
    diagnosis: "ADHD",
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

// Assessments array
export const assessments = [
  {
    id: "a1",
    childId: "c1",
    name: "Initial Screening",
    dateTaken: "2025-06-01",
    type: "Initial",
    status: "Completed",
  },
  {
    id: "a2",
    childId: "c1",
    name: "Follow-up Check",
    dateTaken: "2025-07-10",
    type: "On Demand",
    status: "Pending",
  },
  {
    id: "a3",
    childId: "c2",
    name: "Initial Screening",
    dateTaken: "2025-05-20",
    type: "Initial",
    status: "Completed",
  },
  {
    id: "a4",
    childId: "c3",
    name: "Dyslexia Assessment",
    dateTaken: "2025-07-05",
    type: "On Demand",
    status: "Completed",
  },
];

// Clinician feedbacks array
export const clinicianFeedbacks = [
  {
    id: "f1",
    assessmentId: "a2",
    clinician: "Dr. Smith",
    feedback: "Waiting for review",
  },
  {
    id: "f2",
    assessmentId: "a4",
    clinician: "Dr. Lee",
    feedback: "Patient shows improvement",
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

// Leave requests from clinicians
export const leaveRequests = [
  {
    id: 1,
    clinicianName: "Dr. Sarah Smith",
    fromDate: "2025-08-15",
    toDate: "2025-08-20",
    reason: "Medical Leave",
    status: "Pending",
  },
  {
    id: 2,
    clinicianName: "Dr. John Doe",
    fromDate: "2025-08-10",
    toDate: "2025-08-12",
    reason: "Family Event",
    status: "Approved",
  },
];

// Upcoming leaves schedule
export const upcomingLeaves = [
  {
    id: 1,
    clinicianName: "Dr. Sarah Smith",
    fromDate: "2025-08-15",
    toDate: "2025-08-20",
  },
  {
    id: 2,
    clinicianName: "Dr. Lisa Wong",
    fromDate: "2025-08-25",
    toDate: "2025-08-28",
  },
];
