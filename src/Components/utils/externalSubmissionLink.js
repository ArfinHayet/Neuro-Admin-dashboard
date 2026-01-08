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

  const params = new URLSearchParams({
    assessmentId: assessmentId ?? "{assessmentId}",
    questiontypeid: questiontypeid ?? "{questiontypeid}",
    userId: userId ?? "{userId}",
    patientId: patientId ?? "{patientId}",
    reviewer_name: reviewer_name ?? "{reviewer_name}",
    reviewer_email: reviewer_email ?? "{reviewer_email}",
  });

  return `${baseUrl}?${params.toString()}`;
};

// --- Demo usage ---
// const demoLink = generateExternalSubmissionLink({
//   assessmentId: 2,
//   questiontypeid: 64,
//   userId: 4,
//   patientId: 5,
//   reviewer_name: "John Doe",
//   reviewer_email: "john@example.com",
// });

// console.log("Demo External Submission Link:", demoLink);
