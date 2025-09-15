import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPaymentById } from "../../api/payment";
import { getUserById } from "../../api/user";
import { getAssessmentById } from "../../api/assessments";

const PaymentDetails = () => {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);
  const [user, setUser] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pay = await getPaymentById(id);
        setPayment(pay);

        if (pay?.userId) {
          const u = await getUserById(pay.userId);
          setUser(u);
        }

        if (pay?.assessmentId) {
          const a = await getAssessmentById(pay.assessmentId);
          setAssessment(a);
        }
      } catch (err) {
        console.error("Error fetching payment details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p className="p-4">Loading...</p>;
  if (!payment) return <p className="p-4">Payment not found.</p>;

  return (
     <section className=" ">
      <h1 className="text-xl font-semibold mb-4">Payment Details</h1>

      <div className="space-y-3 text-sm">
        <p><strong>Payment Id</strong> {payment.id}</p>
        <p><strong>Customer Email </strong> {payment.customerEmail}</p>
        <p><strong>Amount </strong> {payment.amount} {payment.currency}</p>
        <p><strong>Status </strong> {payment.paymentStatus}</p>
        <p><strong>Payment Date </strong> {new Date(payment.createdAt).toLocaleString()}</p>

        <p>
          <strong>User Name </strong>
          {payment.user ? JSON.stringify(payment.user) : "null"}
        </p>
        <p>
          <strong>Patient </strong>
          {payment.patient ? JSON.stringify(payment.patient) : "null"}
        </p>
        <p>
          <strong>Assessment </strong>
          {payment.assessment ? JSON.stringify(payment.assessment) : "null"}
        </p>
    
        {user && (
          <p><strong>User Name </strong> {user.name} </p>
        )}

        {payment.patient && (
          <p><strong>Patient Name </strong> {payment.patient.name}</p>
        )}

        {assessment && (
          <p><strong>Assessment Name </strong> {assessment.name}</p>
        )}
      </div>
    </section>
  );
};

export default PaymentDetails;
