// export const generateExternalSubmissionLink = ({
//   assessmentId,
//   questiontypeid,
//   userId,
//   patientId,
//   reviewer_name,
//   reviewer_email,
// }) => {
//   const baseUrl = `${window.location.origin}/external_user_submission`;

//   const params = new URLSearchParams({
//     assessmentId,
//     questiontypeid,
//     userId,
//     patientId,
//     reviewer_name,
//     reviewer_email,
//   });

//   return `${baseUrl}?${params.toString()}`;
// };


// utils/generateExternalLink.js

export const generateExternalSubmissionLink = ({
  assessmentId,
  questiontypeid,
  userId,
  patientId,
  reviewer_name,
  reviewer_email,
} = {}) => {
  const baseUrl = `${window.location.origin}/external_user_submission`;

  // Validate required parameters
  if (!assessmentId || !questiontypeid || !userId || !patientId || !reviewer_name || !reviewer_email) {
    console.error("Missing required parameters for external link generation");
    return null;
  }

  const params = new URLSearchParams({
    assessmentId: String(assessmentId),
    questiontypeid: String(questiontypeid),
    userId: String(userId),
    patientId: String(patientId),
    reviewer_name: String(reviewer_name),
    reviewer_email: String(reviewer_email),
  });

  return `${baseUrl}?${params.toString()}`;
};

// --- Demo usage with REAL values ---
const demoLink = generateExternalSubmissionLink({
  assessmentId: 2,
  questiontypeid: 64,
  userId: 4,
  patientId: 2,
  reviewer_name: "Dr. Sabbir",
  reviewer_email: "sabbir.abdullah.dev@gmail.com",
});

console.log("Demo External Submission Link:", demoLink);

// ✅ Copy this link and test it:
// http://localhost:5173/external_user_submission?assessmentId=2&questiontypeid=64&userId=4&patientId=2&reviewer_name=Dr.+Sabbir&reviewer_email=sabbir.abdullah.dev%40gmail.com

// For production (replace localhost with your domain):
// https://admin.neurocheckpro.com/external_user_submission?assessmentId=2&questiontypeid=64&userId=4&patientId=2&reviewer_name=Dr.+Sabbir&reviewer_email=sabbir.abdullah.dev%40gmail.com