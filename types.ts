export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  photo?: string; // Base64 string for the profile picture
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  dates: string;
  description: string; // Can be bullet points separated by newlines
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  dates: string;
  location: string;
}

export interface Reference {
  id: string;
  name: string;
  contact: string;
  relation: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  objective: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  references: Reference[];
}

export const INITIAL_RESUME_STATE: ResumeData = {
  personalInfo: {
    name: "Shermine Leyma Moena",
    email: "izabelle17leyma@gmail.com",
    phone: "09947014998",
    address: "Sitio Calayaan, Santa Teresita, Batangas",
  },
  objective: "Dedicated and hardworking professional with significant experience in housekeeping and international domestic assistance. Proven ability to adapt to fast-paced environments, maintain high organizational standards, and deliver exceptional service with trustworthiness and integrity.",
  experience: [],
  education: [],
  skills: [],
  references: []
};

// The raw text provided by the user in the prompt, used as default input with corrected typos
export const DEFAULT_RAW_INPUT = `Shermine Leyma Moena
Sitio Calayaan, Santa Teresita, Batangas | 09947014998 | izabelle17leyma@gmail.com

Professional Objective:
Dedicated professional seeking a role where I can utilize my extensive experience in housekeeping and domestic services. Committed to maintaining high standards of cleanliness and organization while adapting to fast-paced environments.

Education:
Housekeeping NC II
School For Academics and Industrial Technology, Inc. (SAINT)
October 12 - December 18, 2019

Secondary
Santa Teresita National High School
Bihis, Santa Teresita, Batangas
2004 - 2005

Work Experience:
Sapporo Products Inc.
Catmon, Santa Maria, Bulacan
2008 - 2011

Domestic Helper
Oman
2016 - 2018

Domestic Helper
Qatar
2021 - 2023

Character References:
Mauris M. Dela Cruz
09560927305
HR Manager

Desiree Yumul
09457162135
Teacher

Qualifications:
- Willing to work in fast-paced surroundings requiring strong organizational and interpersonal skills.
- Hardworking, easy to train, and a fast learner.
- Excellent communication skills and highly trustworthy.
- Ability to make decisions and work effectively under pressure.
- Highly organized, detail-oriented, and able to multitask simultaneously.
- Energetic and flexible to changing operational needs.`;