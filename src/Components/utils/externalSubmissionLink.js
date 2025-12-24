export const generateExternalSubmissionLink = ({
  assessmentId,
  questiontypeid,
  userId,
  patientId,
  reviewerId,
}) => {
  const baseUrl = `${window.location.origin}/external_user_submission`;

  const params = new URLSearchParams({
    assessmentId,
    questiontypeid,
    userId,
    patientId,
    reviewerId,
  });

  return `${baseUrl}?${params.toString()}`;
};
