export interface SeniorPurchaseStat {
  collegeId: string;
  collegeName: string;
  branch: string;
  year: number;
  popularLaptops: { laptopId: string; count: number }[];
}

export const mockColleges = [
  { id: "iit-delhi", name: "IIT Delhi" },
  { id: "iit-bombay", name: "IIT Bombay" },
  { id: "iit-madras", name: "IIT Madras" },
  { id: "nit-trichy", name: "NIT Trichy" },
  { id: "bits-pilani", name: "BITS Pilani" },
  { id: "vit-vellore", name: "VIT Vellore" },
  { id: "manipal", name: "Manipal Institute" },
  { id: "srm", name: "SRM Institute" },
];

export const branches = [
  "CSE",
  "IT",
  "ECE",
  "Mechanical",
  "Civil",
  "Chemical",
  "EEE",
  "Design",
  "Architecture",
  "MBA",
  "Commerce",
  "Arts",
];

export const mockSeniorStats: SeniorPurchaseStat[] = [
  {
    collegeId: "iit-delhi",
    collegeName: "IIT Delhi",
    branch: "CSE",
    year: 2024,
    popularLaptops: [
      { laptopId: "4", count: 52 },
      { laptopId: "10", count: 38 },
      { laptopId: "2", count: 28 },
      { laptopId: "14", count: 24 },
      { laptopId: "1", count: 19 },
    ],
  },
  {
    collegeId: "iit-delhi",
    collegeName: "IIT Delhi",
    branch: "IT",
    year: 2024,
    popularLaptops: [
      { laptopId: "1", count: 42 },
      { laptopId: "9", count: 35 },
      { laptopId: "4", count: 29 },
      { laptopId: "5", count: 22 },
    ],
  },
  {
    collegeId: "iit-delhi",
    collegeName: "IIT Delhi",
    branch: "ECE",
    year: 2024,
    popularLaptops: [
      { laptopId: "1", count: 38 },
      { laptopId: "5", count: 28 },
      { laptopId: "11", count: 24 },
      { laptopId: "9", count: 18 },
    ],
  },
  {
    collegeId: "iit-bombay",
    collegeName: "IIT Bombay",
    branch: "CSE",
    year: 2024,
    popularLaptops: [
      { laptopId: "4", count: 48 },
      { laptopId: "10", count: 42 },
      { laptopId: "7", count: 31 },
      { laptopId: "12", count: 26 },
    ],
  },
  {
    collegeId: "bits-pilani",
    collegeName: "BITS Pilani",
    branch: "CSE",
    year: 2024,
    popularLaptops: [
      { laptopId: "2", count: 45 },
      { laptopId: "9", count: 39 },
      { laptopId: "1", count: 32 },
      { laptopId: "14", count: 21 },
    ],
  },
  {
    collegeId: "nit-trichy",
    collegeName: "NIT Trichy",
    branch: "CSE",
    year: 2024,
    popularLaptops: [
      { laptopId: "9", count: 56 },
      { laptopId: "1", count: 44 },
      { laptopId: "5", count: 33 },
      { laptopId: "11", count: 28 },
    ],
  },
  {
    collegeId: "vit-vellore",
    collegeName: "VIT Vellore",
    branch: "CSE",
    year: 2024,
    popularLaptops: [
      { laptopId: "9", count: 68 },
      { laptopId: "2", count: 52 },
      { laptopId: "1", count: 41 },
      { laptopId: "15", count: 35 },
    ],
  },
];
