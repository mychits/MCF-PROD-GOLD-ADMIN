// src/components/SalarySlipPrint.jsx
import  { useState } from "react";
import { Select } from "antd";
//import { API } from "../api"; // adjust your API import path
import api from "../../instance/TokenInstance";
import imageInput from "../../assets/images/Agent.png";
//import logoBase64 from "../assets/companyLogoBase64"; // keep your base64 logo here

const { Option } = Select;

// const SalarySlipPrint = ({ paymentId }) => {
//   const handleSalaryPrint = async () => {
//     try {
//       // fetch agent details
//       const agentRes = await api.get(`/payment-out/get-salary-payout-by-id/${paymentId}`);
//       const payment = agentRes.data;
//        if (!payment) {
//             console.error("Payment details not found.");
//             return;
//         }
//       console.info(agent);


//       const payslipId = payment.receipt_no || payment._id;
//       const monthYear = payment.paid_month;
//       const fromDate = new Date(payment.from_date);
//       const toDate = new Date(payment.to_date);
//       const absentDays = parseInt(payment.absent_days || 0);
//       const monthlySalary = parseFloat(agent.salary || 0);

//       const dailyRate = monthlySalary / 30;
//       const deduction = dailyRate * absentDays;
//       const net = monthlySalary - deduction - monthlySalary * 0.12 - 200;

//       const formatDate = (date) =>
//         new Date(date).toLocaleDateString("en-IN", {
//           year: "numeric",
//           month: "short",
//           day: "numeric",
//         });

//       const amountInWords = numToWords(net);

//       const htmlContent = `
// <!DOCTYPE html>
// <html>
// <head>
// <meta charset="UTF-8">
// <title>Salary Slip - ${agent?.name || "Employee"}</title>
// <style>
// @page { size: A4; margin: 15mm; }
// body { font-family: 'Times New Roman', serif; margin: 0; color: #000; background: #fff; }
// .container { max-width: 800px; margin: 0 auto; }
// .header { border: 3px solid #000; padding: 15px; margin-bottom: 20px; background: #f5f5f5; }
// .header-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
// .logo { width: 80px; height: 80px; }
// .company-info { text-align: center; flex: 1; }
// .company-name { font-size: 28px; font-weight: bold; margin: 5px 0; }
// .company-addr { font-size: 11px; margin: 2px 0; }
// .payslip-title { text-align: center; font-size: 20px; font-weight: bold; text-decoration: underline; margin: 15px 0; }
// .meta-info { text-align: right; font-size: 12px; }
// .emp-details { border: 2px solid #000; margin: 15px 0; }
// .emp-header { background: #000; color: #fff; padding: 8px; font-weight: bold; text-align: center; }
// .emp-grid { display: grid; grid-template-columns: 1fr 1fr; }
// .emp-item { padding: 8px; border-right: 1px solid #000; border-bottom: 1px solid #000; font-size: 12px; }
// .emp-item:nth-child(even) { border-right: none; }
// .salary-table { width: 100%; border: 2px solid #000; border-collapse: collapse; margin: 15px 0; }
// .salary-table th { background: #000; color: #fff; padding: 10px; border: 1px solid #000; font-size: 14px; }
// .salary-table td { padding: 8px; border: 1px solid #000; font-size: 12px; }
// .total-row { background: #e0e0e0; font-weight: bold; }
// .net-section { border: 3px double #000; padding: 15px; text-align: center; margin: 20px 0; background: #f9f9f9; }
// .net-amount { font-size: 24px; font-weight: bold; margin: 10px 0; }
// .words { font-style: italic; font-size: 11px; margin-top: 10px; }
// .footer { text-align: center; font-size: 10px; margin-top: 30px; border-top: 1px solid #000; padding-top: 10px; }
// </style>
// </head>
// <body>
// <div class="container">
//   <div class="header">
//     <div class="header-top">
//       <img src="${logoBase64}" class="logo" alt="Logo">
//       <div class="company-info">
//         <div class="company-name">COMPANY NAME PRIVATE LIMITED</div>
//         <div class="company-addr">123 Business Park, Tech City, Bangalore, Karnataka - 560001</div>
//         <div class="company-addr">CIN: U12345KA2020PTC123456 | PAN: ABCDE1234F</div>
//       </div>
//       <div class="meta-info">
//         Payslip ID: <strong>${payslipId}</strong><br>
//         Period: <strong>${monthYear}</strong><br>
//         Date: <strong>${new Date().toLocaleDateString()}</strong>
//       </div>
//     </div>
//     <div class="payslip-title">SALARY SLIP</div>
//   </div>

//   <div class="emp-details">
//     <div class="emp-header">EMPLOYEE DETAILS</div>
//     <div class="emp-grid">
//       <div class="emp-item"><strong>Name:</strong> ${agent?.name || "N/A"}</div>
//       <div class="emp-item"><strong>Employee ID:</strong> ${agent?.employeeCode || "N/A"}</div>
//       <div class="emp-item"><strong>Designation:</strong> ${agent?.designation || "N/A"}</div>
//       <div class="emp-item"><strong>Department:</strong> ${agent?.department || "N/A"}</div>
//       <div class="emp-item"><strong>Pay Period:</strong> ${formatDate(fromDate)} to ${formatDate(toDate)}</div>
//       <div class="emp-item"><strong>Paid Days:</strong> ${31 - absentDays}</div>
//       <div class="emp-item"><strong>LOP Days:</strong> ${absentDays}</div>
//       <div class="emp-item"><strong>Payment Date:</strong> ${formatDate(payment.pay_date)}</div>
//     </div>
//   </div>

//   <table class="salary-table">
//     <thead><tr><th>EARNINGS</th><th>AMOUNT (₹)</th><th>DEDUCTIONS</th><th>AMOUNT (₹)</th></tr></thead>
//     <tbody>
//       <tr><td>Basic Salary</td><td>₹${monthlySalary.toFixed(2)}</td><td>Loss of Pay (LOP)</td><td>₹${deduction.toFixed(2)}</td></tr>
//       <tr><td>House Rent Allowance</td><td>₹${(monthlySalary * 0.4).toFixed(2)}</td><td>Employee PF (12%)</td><td>₹${(monthlySalary * 0.12).toFixed(2)}</td></tr>
//       <tr><td>Special Allowance</td><td>₹${(monthlySalary * 0.3).toFixed(2)}</td><td>Professional Tax</td><td>₹200.00</td></tr>
//       <tr><td>Conveyance Allowance</td><td>₹1600.00</td><td>TDS</td><td>₹0.00</td></tr>
//       <tr class="total-row"><td><strong>GROSS EARNINGS</strong></td><td><strong>₹${monthlySalary.toFixed(2)}</strong></td><td><strong>TOTAL DEDUCTIONS</strong></td><td><strong>₹${(deduction + monthlySalary * 0.12 + 200).toFixed(2)}</strong></td></tr>
//     </tbody>
//   </table>

//   <div class="net-section">
//     <div>NET PAYABLE AMOUNT</div>
//     <div class="net-amount">₹${net.toFixed(2)}</div>
//     <div class="words">Amount in words: Indian Rupees ${amountInWords} Only</div>
//   </div>

//   <div class="footer">This is a system-generated payslip. No signature required.<br>&copy; ${new Date().getFullYear()} Company Name Pvt Ltd. Confidential.</div>
// </div>
// </body>
// </html>
// `;

//       const printWindow = window.open("", "_blank");
//       printWindow.document.write(htmlContent);
//       printWindow.document.close();
//       printWindow.print();
//     } catch (err) {
//       console.error("Error printing salary slip:", err);
//     }
//   };

//   // helper to convert numbers to words
//   const numToWords = (num) => {
//     const a = [
//       "",
//       "One",
//       "Two",
//       "Three",
//       "Four",
//       "Five",
//       "Six",
//       "Seven",
//       "Eight",
//       "Nine",
//       "Ten",
//       "Eleven",
//       "Twelve",
//       "Thirteen",
//       "Fourteen",
//       "Fifteen",
//       "Sixteen",
//       "Seventeen",
//       "Eighteen",
//       "Nineteen",
//     ];
//     const b = [
//       "",
//       "",
//       "Twenty",
//       "Thirty",
//       "Forty",
//       "Fifty",
//       "Sixty",
//       "Seventy",
//       "Eighty",
//       "Ninety",
//     ];
//     if ((num = num.toString()).length > 9) return "Overflow";
//     const n = ("000000000" + num)
//       .substr(-9)
//       .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
//     if (!n) return;
//     let str = "";
//     str +=
//       n[1] != 0
//         ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + " Crore "
//         : "";
//     str +=
//       n[2] != 0
//         ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + " Lakh "
//         : "";
//     str +=
//       n[3] != 0
//         ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + " Thousand "
//         : "";
//     str +=
//       n[4] != 0
//         ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + " Hundred "
//         : "";
//     str +=
//       n[5] != 0
//         ? (str != "" ? "and " : "") +
//           (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]]) +
//           " "
//         : "";
//     return str.trim();
//   };

//   return (
//     <button
//       className="px-4 py-2 bg-blue-600 text-white rounded"
//       onClick={handleSalaryPrint}
//     >
//       Print Salary Slip
//     </button>
//   );
// };

// const SalarySlipPrint = ({ payment }) => {
//   // Check if payment object and agent details exist before trying to print
//   if (!payment || typeof payment !== 'object' || !payment.agent_id) {
//     console.error("Payment details or agent information are missing.");
//     return null; // Return null to not render anything if data is missing
//   }

//   const handleSalaryPrint = () => {
//     try {
//       const agent = payment.agent_id;

//       const payslipId = payment.receipt_no || payment._id;
//       const monthYear = payment.paid_month;
//       const fromDate = new Date(payment.from_date);
//       const toDate = new Date(payment.to_date);
//       const absentDays = parseInt(payment.absent_days || 0);
//       const monthlySalary = parseFloat(agent.salary || 0);

//       const dailyRate = monthlySalary / 30;
//       const deduction = dailyRate * absentDays;
//       const net = monthlySalary - deduction - monthlySalary * 0.12 - 200;

//       const formatDate = (date) =>
//         new Date(date).toLocaleDateString("en-IN", {
//           year: "numeric",
//           month: "short",
//           day: "numeric",
//         });

//       const amountInWords = numToWords(net);

//       const htmlContent = `
//         <!DOCTYPE html>
//         <html>
//         <head>
//         <meta charset="UTF-8">
//         <title>Salary Slip - ${agent?.name || "Employee"}</title>
//         <style>
//         @page { size: A4; margin: 15mm; }
//         body { font-family: 'Times New Roman', serif; margin: 0; color: #000; background: #fff; }
//         .container { max-width: 800px; margin: 0 auto; }
//         .header { border: 3px solid #000; padding: 15px; margin-bottom: 20px; background: #f5f5f5; }
//         .header-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
//         .logo { width: 80px; height: 80px; }
//         .company-info { text-align: center; flex: 1; }
//         .company-name { font-size: 28px; font-weight: bold; margin: 5px 0; }
//         .company-addr { font-size: 11px; margin: 2px 0; }
//         .payslip-title { text-align: center; font-size: 20px; font-weight: bold; text-decoration: underline; margin: 15px 0; }
//         .meta-info { text-align: right; font-size: 12px; }
//         .emp-details { border: 2px solid #000; margin: 15px 0; }
//         .emp-header { background: #000; color: #fff; padding: 8px; font-weight: bold; text-align: center; }
//         .emp-grid { display: grid; grid-template-columns: 1fr 1fr; }
//         .emp-item { padding: 8px; border-right: 1px solid #000; border-bottom: 1px solid #000; font-size: 12px; }
//         .emp-item:nth-child(even) { border-right: none; }
//         .salary-table { width: 100%; border: 2px solid #000; border-collapse: collapse; margin: 15px 0; }
//         .salary-table th { background: #000; color: #fff; padding: 10px; border: 1px solid #000; font-size: 14px; }
//         .salary-table td { padding: 8px; border: 1px solid #000; font-size: 12px; }
//         .total-row { background: #e0e0e0; font-weight: bold; }
//         .net-section { border: 3px double #000; padding: 15px; text-align: center; margin: 20px 0; background: #f9f9f9; }
//         .net-amount { font-size: 24px; font-weight: bold; margin: 10px 0; }
//         .words { font-style: italic; font-size: 11px; margin-top: 10px; }
//         .footer { text-align: center; font-size: 10px; margin-top: 30px; border-top: 1px solid #000; padding-top: 10px; }
//         </style>
//         </head>
//         <body>
//         <div class="container">
//           <div class="header">
//             <div class="header-top">
//               <img src="${imageInput}" class="logo" alt="Logo">
//               <div class="company-info">
//                 <div class="company-name">COMPANY NAME PRIVATE LIMITED</div>
//                 <div class="company-addr">123 Business Park, Tech City, Bangalore, Karnataka - 560001</div>
//                 <div class="company-addr">CIN: U12345KA2020PTC123456 | PAN: ABCDE1234F</div>
//               </div>
//               <div class="meta-info">
//                 Payslip ID: <strong>${payslipId}</strong><br>
//                 Period: <strong>${monthYear}</strong><br>
//                 Date: <strong>${new Date().toLocaleDateString()}</strong>
//               </div>
//             </div>
//             <div class="payslip-title">SALARY SLIP</div>
//           </div>
        
//           <div class="emp-details">
//             <div class="emp-header">EMPLOYEE DETAILS</div>
//             <div class="emp-grid">
//               <div class="emp-item"><strong>Name:</strong> ${agent?.name || "N/A"}</div>
//               <div class="emp-item"><strong>Employee ID:</strong> ${agent?.employeeCode || "N/A"}</div>
//               <div class="emp-item"><strong>Designation:</strong> ${agent?.designation || "N/A"}</div>
//               <div class="emp-item"><strong>Department:</strong> ${agent?.department || "N/A"}</div>
//               <div class="emp-item"><strong>Pay Period:</strong> ${formatDate(fromDate)} to ${formatDate(toDate)}</div>
//               <div class="emp-item"><strong>Paid Days:</strong> ${31 - absentDays}</div>
//               <div class="emp-item"><strong>LOP Days:</strong> ${absentDays}</div>
//               <div class="emp-item"><strong>Payment Date:</strong> ${formatDate(payment.pay_date)}</div>
//             </div>
//           </div>
        
//           <table class="salary-table">
//             <thead><tr><th>EARNINGS</th><th>AMOUNT (₹)</th><th>DEDUCTIONS</th><th>AMOUNT (₹)</th></tr></thead>
//             <tbody>
//               <tr><td>Basic Salary</td><td>₹${monthlySalary.toFixed(2)}</td><td>Loss of Pay (LOP)</td><td>₹${deduction.toFixed(2)}</td></tr>
//               <tr><td>House Rent Allowance</td><td>₹${(monthlySalary * 0.4).toFixed(2)}</td><td>Employee PF (12%)</td><td>₹${(monthlySalary * 0.12).toFixed(2)}</td></tr>
//               <tr><td>Special Allowance</td><td>₹${(monthlySalary * 0.3).toFixed(2)}</td><td>Professional Tax</td><td>₹200.00</td></tr>
//               <tr><td>Conveyance Allowance</td><td>₹1600.00</td><td>TDS</td><td>₹0.00</td></tr>
//               <tr class="total-row"><td><strong>GROSS EARNINGS</strong></td><td><strong>₹${monthlySalary.toFixed(2)}</strong></td><td><strong>TOTAL DEDUCTIONS</strong></td><td><strong>₹${(deduction + monthlySalary * 0.12 + 200).toFixed(2)}</strong></td></tr>
//             </tbody>
//           </table>
        
//           <div class="net-section">
//             <div>NET PAYABLE AMOUNT</div>
//             <div class="net-amount">₹${net.toFixed(2)}</div>
//             <div class="words">Amount in words: Indian Rupees ${amountInWords} Only</div>
//           </div>
        
//           <div class="footer">This is a system-generated payslip. No signature required.<br>&copy; ${new Date().getFullYear()} Company Name Pvt Ltd. Confidential.</div>
//         </div>
//         </body>
//         </html>
//       `;

//       const printWindow = window.open("", "_blank");
//       printWindow.document.write(htmlContent);
//       printWindow.document.close();
//       printWindow.print();
//     } catch (err) {
//       console.error("Error printing salary slip:", err);
//     }
//   };

//   const numToWords = (num) => {
//     const a = [
//       "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
//       "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
//     ];
//     const b = [
//       "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
//     ];
//     if ((num = num.toString()).length > 9) return "Overflow";
//     const n = ("000000000" + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
//     if (!n) return;
//     let str = "";
//     str += n[1] != 0 ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + " Crore " : "";
//     str += n[2] != 0 ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + " Lakh " : "";
//     str += n[3] != 0 ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + " Thousand " : "";
//     str += n[4] != 0 ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + " Hundred " : "";
//     str += n[5] != 0 ? (str != "" ? "and " : "") + (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]]) + " " : "";
//     return str.trim();
//   };

//   return (
//     <button
//       className="px-4 py-2 bg-blue-600 text-white rounded"
//       onClick={handleSalaryPrint}
//     >
//       Print Salary Slip
//     </button>
//   );
// };

const SalarySlipPrint = ({ payment }) => {
  const [printFormat, setPrintFormat] = useState("format1");

  // Check if payment object and agent details exist before trying to print
  if (!payment || typeof payment !== "object" || !payment.agent_id) {
    console.error("Payment details or agent information are missing.");
    return null; // Return null to not render anything if data is missing
  }

  // const handleSalaryPrint = () => {
  //   try {
  //     const agent = payment.agent_id;
  //     console.info(agent);

  //     const payslipId = payment.receipt_no || payment._id;
  //     const monthYear = payment.paid_month;
  //     const fromDate = new Date(payment.from_date);
  //     const toDate = new Date(payment.to_date);
  //     const absentDays = parseInt(payment.absent_days || 0);
  //     const monthlySalary = parseFloat(agent.salary || 0);
  //     const dailyRate = monthlySalary / 30;
  //     const deduction = dailyRate * absentDays;
  //     const net = monthlySalary - deduction - monthlySalary * 0.12 - 200;

  //     const formatDate = (date) =>
  //       new Date(date).toLocaleDateString("en-IN", {
  //         year: "numeric",
  //         month: "short",
  //         day: "numeric",
  //       });

  //     const amountInWords = numToWords(net);

  //     const format1 = `
  //       <!DOCTYPE html>
  //       <html>
  //       <head>
  //       <meta charset="UTF-8">
  //       <title>Salary Slip - ${agent?.name || "Employee"}</title>
  //       <style>
  //       @page { size: A4; margin: 15mm; }
  //       body { font-family: 'Times New Roman', serif; margin: 0; color: #000; background: #fff; }
  //       .container { max-width: 800px; margin: 0 auto; }
  //       .header { border: 3px solid #000; padding: 15px; margin-bottom: 20px; background: #f5f5f5; }
  //       .header-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
  //       .logo { width: 80px; height: 80px; }
  //       .company-info { text-align: center; flex: 1; }
  //       .company-name { font-size: 28px; font-weight: bold; margin: 5px 0; }
  //       .company-addr { font-size: 11px; margin: 2px 0; }
  //       .payslip-title { text-align: center; font-size: 20px; font-weight: bold; text-decoration: underline; margin: 15px 0; }
  //       .meta-info { text-align: right; font-size: 12px; }
  //       .emp-details { border: 2px solid #000; margin: 15px 0; }
  //       .emp-header { background: #000; color: #fff; padding: 8px; font-weight: bold; text-align: center; }
  //       .emp-grid { display: grid; grid-template-columns: 1fr 1fr; }
  //       .emp-item { padding: 8px; border-right: 1px solid #000; border-bottom: 1px solid #000; font-size: 12px; }
  //       .emp-item:nth-child(even) { border-right: none; }
  //       .salary-table { width: 100%; border: 2px solid #000; border-collapse: collapse; margin: 15px 0; }
  //       .salary-table th { background: #000; color: #fff; padding: 10px; border: 1px solid #000; font-size: 14px; }
  //       .salary-table td { padding: 8px; border: 1px solid #000; font-size: 12px; }
  //       .total-row { background: #e0e0e0; font-weight: bold; }
  //       .net-section { border: 3px double #000; padding: 15px; text-align: center; margin: 20px 0; background: #f9f9f9; }
  //       .net-amount { font-size: 24px; font-weight: bold; margin: 10px 0; }
  //       .words { font-style: italic; font-size: 11px; margin-top: 10px; }
  //       .footer { text-align: center; font-size: 10px; margin-top: 30px; border-top: 1px solid #000; padding-top: 10px; }
  //       </style>
  //       </head>
  //       <body>
  //       <div class="container">
  //         <div class="header">
  //           <div class="header-top">
  //             <img src="${imageInput}" class="logo" alt="Logo">
  //             <div class="company-info">
  //               <div class="company-name">Mychits</div>
  //               <div class="company-addr">No 11/36-25, 2nd Main, Kathriguppe Main Road, Bangalore, Karnataka, India - 560070</div>
  //               <div class="company-addr">CIN: U65999KA2022PTC161858</div>
  //             </div>
  //             <div class="meta-info">
  //               Payslip ID: <strong>${payslipId}</strong><br>
                
  //               Date: <strong>${new Date().toLocaleDateString()}</strong>
  //             </div>
  //           </div>
  //           <div class="payslip-title">SALARY SLIP</div>
  //         </div>
        
  //         <div class="emp-details">
  //           <div class="emp-header">EMPLOYEE DETAILS</div>
  //           <div class="emp-grid">
  //             <div class="emp-item"><strong>Name:</strong> ${agent?.name || "N/A"}</div>
  //             <div class="emp-item"><strong>Employee ID:</strong> ${agent?.employeeCode || "N/A"}</div>
  //             <div class="emp-item"><strong>Designation:</strong> ${agent?.designation_id?.title || "N/A"}</div>
  //             <div class="emp-item"><strong>Department:</strong> ${agent?.department || "N/A"}</div>
  //             <div class="emp-item"><strong>Pay Period:</strong> ${formatDate(fromDate)} to ${formatDate(toDate)}</div>
  //             <div class="emp-item"><strong>Paid Days:</strong> ${monthYear - absentDays}</div>
  //             <div class="emp-item"><strong>LOP Days:</strong> ${absent}</div>
  //             <div class="emp-item"><strong>Payment Date:</strong> ${formatDate(payment.pay_date)}</div>
  //           </div>
  //         </div>
        
  //         <table class="salary-table">
  //           <thead><tr><th>EARNINGS</th><th>AMOUNT (₹)</th><th>DEDUCTIONS</th><th>AMOUNT (₹)</th></tr></thead>
  //           <tbody>
  //             <tr><td>Basic Salary</td><td>₹${monthlySalary.toFixed(2)}</td><td>Loss of Pay (LOP)</td><td>₹${deduction.toFixed(2)}</td></tr>
  //             <tr><td>House Rent Allowance</td><td>₹${(monthlySalary * 0.4).toFixed(2)}</td><td>Employee PF (12%)</td><td>₹${(monthlySalary * 0.12).toFixed(2)}</td></tr>
  //             <tr><td>Special Allowance</td><td>₹${(monthlySalary * 0.3).toFixed(2)}</td><td>Professional Tax</td><td>₹200.00</td></tr>
  //             <tr><td>Conveyance Allowance</td><td>₹1600.00</td><td>TDS</td><td>₹0.00</td></tr>
  //             <tr class="total-row"><td><strong>GROSS EARNINGS</strong></td><td><strong>₹${monthlySalary.toFixed(2)}</strong></td><td><strong>TOTAL DEDUCTIONS</strong></td><td><strong>₹${(deduction + monthlySalary * 0.12 + 200).toFixed(2)}</strong></td></tr>
  //           </tbody>
  //         </table>
        
  //         <div class="net-section">
  //           <div>NET PAYABLE AMOUNT</div>
  //           <div class="net-amount">₹${net.toFixed(2)}</div>
  //           <div class="words">Amount in words: Indian Rupees ${amountInWords} Only</div>
  //         </div>
        
  //         <div class="footer">This is a system-generated payslip. No signature required.<br>&copy; ${new Date().getFullYear()} Company Name Pvt Ltd. Confidential.</div>
  //       </div>
  //       </body>
  //       </html>
  //     `;

  //     const format2 = `
  //       <!DOCTYPE html>
  //       <html><head><meta charset="UTF-8"><title>Salary Slip - ${agent?.name || "Employee"}</title>
  //       <style>
  //       @page { size: A4; margin: 10mm; }
  //       body { font-family: 'Helvetica', Arial, sans-serif; margin: 0; color: #2c3e50; background: #fff; line-height: 1.4; }
  //       .container { max-width: 800px; margin: 0 auto; padding: 20px; }
  //       .header { margin-bottom: 30px; }
  //       .header-line { height: 4px; background: linear-gradient(90deg, #3498db, #2980b9); margin-bottom: 20px; }
  //       .header-content { display: flex; align-items: start; gap: 20px; }
  //       .logo { width: 60px; height: 60px; border-radius: 50%; }
  //       .company-section { flex: 1; }
  //       .company-name { font-size: 26px; font-weight: 300; color: #2c3e50; margin-bottom: 5px; }
  //       .company-tagline { font-size: 12px; color: #7f8c8d; text-transform: uppercase; letter-spacing: 1px; }
  //       .payslip-info { text-align: right; background: #ecf0f1; padding: 15px; border-radius: 8px; min-width: 200px; }
  //       .info-item { font-size: 11px; margin: 3px 0; color: #34495e; }
  //       .info-value { font-weight: 600; color: #2c3e50; }
  //       .section { margin: 25px 0; }
  //       .section-header { font-size: 14px; font-weight: 600; color: #2980b9; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px; }
  //       .emp-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #ecf0f1; }
  //       .emp-label { font-size: 13px; color: #7f8c8d; font-weight: 500; }
  //       .emp-value { font-size: 13px; color: #2c3e50; font-weight: 600; }
  //       .salary-container { background: #fff; border: 1px solid #ecf0f1; border-radius: 8px; overflow: hidden; }
  //       .salary-header { background: #34495e; color: #fff; display: grid; grid-template-columns: 1fr 120px 1fr 120px; }
  //       .salary-header div { padding: 15px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
  //       .salary-row { display: grid; grid-template-columns: 1fr 120px 1fr 120px; border-bottom: 1px solid #ecf0f1; }
  //       .salary-row:nth-child(even) { background: #f8f9fa; }
  //       .salary-row div { padding: 12px 15px; font-size: 12px; }
  //       .amount { font-weight: 600; text-align: right; }
  //       .earning { color: #27ae60; }
  //       .deduction { color: #e74c3c; }
  //       .total-row { background: #3498db !important; color: #fff; font-weight: bold; }
  //       .net-pay { background: #2c3e50; color: #fff; padding: 25px; border-radius: 8px; text-align: center; margin: 25px 0; }
  //       .net-label { font-size: 14px; margin-bottom: 8px; opacity: 0.8; }
  //       .net-value { font-size: 28px; font-weight: 300; margin-bottom: 15px; }
  //       .amount-text { background: rgba(255,255,255,0.1); padding: 12px; border-radius: 4px; font-size: 11px; }
  //       .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ecf0f1; color: #95a5a6; font-size: 10px; }
  //       </style></head><body><div class="container">
  //       <div class="header">
  //         <div class="header-line"></div>
  //         <div class="header-content">
  //           <img src="${imageInput}" class="logo" alt="Logo">
  //           <div class="company-section">
  //             <div class="company-name">Mychits</div>
  //             <div class="company-tagline">Excellence in Business Solutions</div>
  //           </div>
  //           <div class="payslip-info">
  //             <div class="info-item">ID: <span class="info-value">${payslipId}</span></div>
             
  //             <div class="info-item">Generated: <span class="info-value">${new Date().toLocaleDateString()}</span></div>
  //           </div>
  //         </div>
  //       </div>
  //       <div class="section">
  //         <div class="section-header">Employee Information</div>
  //         <div class="emp-row"><div class="emp-label">Employee Name</div><div class="emp-value">${agent?.name || "N/A"}</div></div>
  //         <div class="emp-row"><div class="emp-label">Employee ID</div><div class="emp-value">${agent?.employeeCode || "N/A"}</div></div>
  //         <div class="emp-row"><div class="emp-label">Designation</div><div class="emp-value">${agent?.designation_id?.title || "N/A"}</div></div>
  //         <div class="emp-row"><div class="emp-label">Department</div><div class="emp-value">${agent?.department || "N/A"}</div></div>
  //         <div class="emp-row"><div class="emp-label">Pay Period</div><div class="emp-value">${formatDate(fromDate)} to ${formatDate(toDate)}</div></div>
  //         <div class="emp-row"><div class="emp-label">Working Days</div><div class="emp-value">${Math.floor((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1 - absentDays}</div></div>
  //         <div class="emp-row"><div class="emp-label">LOP Days</div><div class="emp-value">${absentDays}</div></div>
  //       </div>
  //       <div class="section">
  //         <div class="section-header">Salary Breakdown</div>
  //         <div class="salary-container">
  //           <div class="salary-header">
  //             <div>Earnings</div><div>Amount</div><div>Deductions</div><div>Amount</div>
  //           </div>
  //           <div class="salary-row">
  //             <div>Basic Salary</div><div class="amount earning">₹${monthlySalary.toFixed(2)}</div><div>Loss of Pay</div><div class="amount deduction">₹${deduction}</div>
  //           </div>
  //           <div class="salary-row">
  //             <div>HRA (40%)</div><div class="amount earning">₹${(monthlySalary * 0.4).toFixed(2)}</div><div>PF (12%)</div><div class="amount deduction">₹${(monthlySalary * 0.12).toFixed(2)}</div>
  //           </div>
  //           <div class="salary-row">
  //             <div>Special Allowance</div><div class="amount earning">₹${(monthlySalary * 0.3).toFixed(2)}</div><div>Professional Tax</div><div class="amount deduction">₹200.00</div>
  //           </div>
  //           <div class="salary-row">
  //             <div>Conveyance</div><div class="amount earning">₹1600.00</div><div>TDS</div><div class="amount deduction">₹0.00</div>
  //           </div>
  //           <div class="salary-row total-row">
  //             <div>Total Earnings</div><div class="amount">₹${monthlySalary.toFixed(2)}</div><div>Total Deductions</div><div class="amount">₹${(parseFloat(deduction) + monthlySalary * 0.12 + 200).toFixed(2)}</div>
  //           </div>
  //         </div>
  //       </div>
  //       <div class="net-pay">
  //         <div class="net-label">Net Payable</div>
  //         <div class="net-value">₹${parseFloat(net).toFixed(2)}</div>
  //         <div class="amount-text">Indian Rupees ${amountInWords} Only</div>
  //       </div>
  //       <div class="footer">System Generated • No Signature Required • Confidential Document</div>
  //       </div></body></html>
  //     `;

  //     const htmlContent = printFormat === "format1" ? format1 : format2;

  //     const printWindow = window.open("", "_blank");
  //     printWindow.document.write(htmlContent);
  //     printWindow.document.close();
  //     printWindow.print();
  //   } catch (err) {
  //     console.error("Error printing salary slip:", err);
  //   }
  // };

const handleSalaryPrint = () => {
  try {
    // 🔍 SAFE EXTRACTION FROM payment OBJECT (based on your provided data)
    const agent = payment.agent_id;
    const payslipId = payment.receipt_no || payment._id;
    const payDate = payment.pay_date;
    const paidMonth = payment.paid_month;
    const fromDate = new Date(payment.from_date);
    const toDate = new Date(payment.to_date);
    const absentDays = parseInt(payment.absent_days || 0); // ✅ From your data: "1"
    const monthlySalary = parseFloat(agent?.salary || 0);

    // ❗ Validate critical data
    if (!agent) throw new Error("Agent data not found");
    if (isNaN(monthlySalary)) throw new Error("Invalid salary value");

    // Calculate days in paid month dynamically
    const monthYear = new Date(paidMonth + "-01");
    const daysInMonth = new Date(monthYear.getFullYear(), monthYear.getMonth() + 1, 0).getDate();
    const dailyRate = monthlySalary / daysInMonth;

    const deduction = absentDays * dailyRate;
    const net = monthlySalary - deduction - 2000; // totalPayableWithIncentive

    const formatDate = (date) =>
      new Date(date).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

    const amountInWords = numToWords(net);

    // --- FORMAT 1 ---
    const format1 = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
         <title>Salary Slip</title>
        <style>
          @page { size: A4; margin: 15mm; }
          body { font-family: 'Times New Roman', serif; margin: 0; color: #000; background: #fff; }
          .container { max-width: 800px; margin: 0 auto; }
          .header { border: 3px solid #000; padding: 15px; margin-bottom: 20px; background: #f5f5f5; }
          .header-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
          .logo { width: 80px; height: 80px; }
          .company-info { text-align: center; flex: 1; }
          .company-name { font-size: 28px; font-weight: bold; margin: 5px 0; }
          .company-addr { font-size: 11px; margin: 2px 0; }
          .payslip-title { text-align: center; font-size: 20px; font-weight: bold; text-decoration: underline; margin: 15px 0; }
          .meta-info { text-align: right; font-size: 12px; }
          .emp-details { border: 2px solid #000; margin: 15px 0; }
          .emp-header { background: #000; color: #fff; padding: 8px; font-weight: bold; text-align: center; }
          .emp-grid { display: grid; grid-template-columns: 1fr 1fr; }
          .emp-item { padding: 8px; border-right: 1px solid #000; border-bottom: 1px solid #000; font-size: 12px; }
          .emp-item:nth-child(even) { border-right: none; }
          .salary-table { width: 100%; border: 2px solid #000; border-collapse: collapse; margin: 15px 0; }
          .salary-table th { background: #000; color: #fff; padding: 10px; border: 1px solid #000; font-size: 14px; }
          .salary-table td { padding: 8px; border: 1px solid #000; font-size: 12px; }
          .total-row { background: #e0e0e0; font-weight: bold; }
          .net-section { border: 3px double #000; padding: 15px; text-align: center; margin: 20px 0; background: #f9f9f9; }
          .net-amount { font-size: 24px; font-weight: bold; margin: 10px 0; }
          .words { font-style: italic; font-size: 11px; margin-top: 10px; }
          .footer { text-align: center; font-size: 10px; margin-top: 30px; border-top: 1px solid #000; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="header-top">
              <img src="${imageInput}" class="logo" alt="Logo">
              <div class="company-info">
                <div class="company-name">Mychits</div>
                <div class="company-addr">No 11/36-25, 2nd Main, Kathriguppe Main Road, Bangalore, Karnataka, India - 560070</div>
                <div class="company-addr">CIN: U65999KA2022PTC161858</div>
              </div>
              <div class="meta-info">
                Payslip ID: <strong>${payslipId}</strong><br>
                Date: <strong>${new Date().toLocaleDateString()}</strong>
              </div>
            </div>
            <div class="payslip-title">SALARY SLIP</div>
          </div>

          <div class="emp-details">
            <div class="emp-header">EMPLOYEE DETAILS</div>
            <div class="emp-grid">
              <div class="emp-item"><strong>Name:</strong> ${agent?.name || "N/A"}</div>
              <div class="emp-item"><strong>Employee ID:</strong> ${agent?.employeeCode || "N/A"}</div>
              <div class="emp-item"><strong>Designation:</strong> ${agent?.designation_id?.title || "N/A"}</div>
              <div class="emp-item"><strong>Department:</strong> ${agent?.department || "N/A"}</div>
              <div class="emp-item"><strong>Pay Period:</strong> ${formatDate(fromDate)} to ${formatDate(toDate)}</div>
              <div class="emp-item"><strong>Paid Days:</strong> ${daysInMonth - absentDays}</div>
              <div class="emp-item"><strong>LOP Days:</strong> ${absentDays}</div>
              <div class="emp-item"><strong>Payment Date:</strong> ${formatDate(payDate)}</div>
            </div>
          </div>

          <table class="salary-table">
            <thead><tr><th>EARNINGS</th><th>AMOUNT (₹)</th><th>DEDUCTIONS</th><th>AMOUNT (₹)</th></tr></thead>
            <tbody>
              <tr><td>Basic Salary</td><td>₹${monthlySalary}</td><td>Loss of Pay (LOP)</td><td>₹${deduction.toFixed(2)}</td></tr>
              <tr><td>House Rent Allowance</td><td>₹${0}</td><td>Employee PF </td><td>₹${(1800).toFixed(2)}</td></tr>
              <tr><td>Special Allowance</td><td>₹${0}</td><td>Health Insurance</td><td>${(200).toFixed(2)}</td></tr>
              <tr><td>Conveyance Allowance</td><td>₹0.00</td><td>TDS</td><td>₹0.00</td></tr>
              <tr class="total-row">
                <td><strong>GROSS EARNINGS</strong></td>
                <td><strong>₹${monthlySalary.toFixed(2)}</strong></td>
                <td><strong>TOTAL DEDUCTIONS</strong></td>
                <td><strong>₹${(deduction + monthlySalary * 0.12 + 200).toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </table>

          <div class="net-section">
            <div>NET PAYABLE AMOUNT</div>
            <div class="net-amount">₹${net.toFixed(2)}</div>
            <div class="words">Amount in words: Indian Rupees ${amountInWords} Only</div>
          </div>

          <div class="footer">This is a system-generated payslip. No signature required.<br>&copy; ${new Date().getFullYear()} Company Name Pvt Ltd. Confidential.</div>
        </div>
      </body>
      </html>
    `;

    // --- FORMAT 2 (Optional, same structure) ---
    const format2 = `
      <!DOCTYPE html>
      <html><head><meta charset="UTF-8"><title>Salary Slip - ${agent?.name || "Employee"}</title>
      <style>
        @page { size: A4; margin: 10mm; }
        body { font-family: 'Helvetica', Arial, sans-serif; margin: 0; color: #2c3e50; background: #fff; line-height: 1.4; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { margin-bottom: 30px; }
        .header-line { height: 4px; background: linear-gradient(90deg, #3498db, #2980b9); margin-bottom: 20px; }
        .header-content { display: flex; align-items: start; gap: 20px; }
        .logo { width: 60px; height: 60px; border-radius: 50%; }
        .company-section { flex: 1; }
        .company-name { font-size: 26px; font-weight: 300; color: #2c3e50; margin-bottom: 5px; }
        .company-tagline { font-size: 12px; color: #7f8c8d; text-transform: uppercase; letter-spacing: 1px; }
        .payslip-info { text-align: right; background: #ecf0f1; padding: 15px; border-radius: 8px; min-width: 200px; }
        .info-item { font-size: 11px; margin: 3px 0; color: #34495e; }
        .info-value { font-weight: 600; color: #2c3e50; }
        .section { margin: 25px 0; }
        .section-header { font-size: 14px; font-weight: 600; color: #2980b9; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px; }
        .emp-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #ecf0f1; }
        .emp-label { font-size: 13px; color: #7f8c8d; font-weight: 500; }
        .emp-value { font-size: 13px; color: #2c3e50; font-weight: 600; }
        .salary-container { background: #fff; border: 1px solid #ecf0f1; border-radius: 8px; overflow: hidden; }
        .salary-header { background: #34495e; color: #fff; display: grid; grid-template-columns: 1fr 120px 1fr 120px; }
        .salary-header div { padding: 15px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
        .salary-row { display: grid; grid-template-columns: 1fr 120px 1fr 120px; border-bottom: 1px solid #ecf0f1; }
        .salary-row:nth-child(even) { background: #f8f9fa; }
        .salary-row div { padding: 12px 15px; font-size: 12px; }
        .amount { font-weight: 600; text-align: right; }
        .earning { color: #27ae60; }
        .deduction { color: #e74c3c; }
        .total-row { background: #3498db !important; color: #fff; font-weight: bold; }
        .net-pay { background: #2c3e50; color: #fff; padding: 25px; border-radius: 8px; text-align: center; margin: 25px 0; }
        .net-label { font-size: 14px; margin-bottom: 8px; opacity: 0.8; }
        .net-value { font-size: 28px; font-weight: 300; margin-bottom: 15px; }
        .amount-text { background: rgba(255,255,255,0.1); padding: 12px; border-radius: 4px; font-size: 11px; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ecf0f1; color: #95a5a6; font-size: 10px; }
      </style></head><body><div class="container">
        <div class="header">
          <div class="header-line"></div>
          <div class="header-content">
            <img src="${imageInput}" class="logo" alt="Logo">
            <div class="company-section">
              <div class="company-name">Mychits</div>
              <div class="company-tagline">Excellence in Business Solutions</div>
            </div>
            <div class="payslip-info">
              <div class="info-item">ID: <span class="info-value">${payslipId}</span></div>
              <div class="info-item">Generated: <span class="info-value">${new Date().toLocaleDateString()}</span></div>
            </div>
          </div>
        </div>
        <div class="section">
          <div class="section-header">Employee Information</div>
          <div class="emp-row"><div class="emp-label">Employee Name</div><div class="emp-value">${agent?.name || "N/A"}</div></div>
          <div class="emp-row"><div class="emp-label">Employee ID</div><div class="emp-value">${agent?.employeeCode || "N/A"}</div></div>
          <div class="emp-row"><div class="emp-label">Designation</div><div class="emp-value">${agent?.designation_id?.title || "N/A"}</div></div>
          <div class="emp-row"><div class="emp-label">Department</div><div class="emp-value">${agent?.department || "N/A"}</div></div>
          <div class="emp-row"><div class="emp-label">Pay Period</div><div class="emp-value">${formatDate(fromDate)} to ${formatDate(toDate)}</div></div>
          <div class="emp-row"><div class="emp-label">Working Days</div><div class="emp-value">${daysInMonth - absentDays}</div></div>
          <div class="emp-row"><div class="emp-label">LOP Days</div><div class="emp-value">${absentDays}</div></div>
        </div>
        <div class="section">
          <div class="section-header">Salary Breakdown</div>
          <div class="salary-container">
            <div class="salary-header">
              <div>Earnings</div><div>Amount</div><div>Deductions</div><div>Amount</div>
            </div>
            <div class="salary-row">
              <div>Basic Salary</div><div class="amount earning">₹${monthlySalary.toFixed(2)}</div><div>Loss of Pay</div><div class="amount deduction">₹${deduction.toFixed(2)}</div>
            </div>
            <div class="salary-row">
              <div>HRA (40%)</div><div class="amount earning">₹${(monthlySalary * 0.4).toFixed(2)}</div><div>PF (12%)</div><div class="amount deduction">₹${(monthlySalary * 0.12).toFixed(2)}</div>
            </div>
            <div class="salary-row">
              <div>Special Allowance</div><div class="amount earning">₹${(monthlySalary * 0.3).toFixed(2)}</div><div>Professional Tax</div><div class="amount deduction">₹200.00</div>
            </div>
            <div class="salary-row">
              <div>Conveyance</div><div class="amount earning">₹1600.00</div><div>TDS</div><div class="amount deduction">₹0.00</div>
            </div>
            <div class="salary-row total-row">
              <div>Total Earnings</div><div class="amount">₹${monthlySalary.toFixed(2)}</div><div>Total Deductions</div><div class="amount">₹${(deduction + monthlySalary * 0.12 + 200).toFixed(2)}</div>
            </div>
          </div>
        </div>
        <div class="net-pay">
          <div class="net-label">Net Payable</div>
          <div class="net-value">₹${net.toFixed(2)}</div>
          <div class="amount-text">Indian Rupees ${amountInWords} Only</div>
        </div>
        <div class="footer">System Generated • No Signature Required • Confidential Document</div>
      </div></body></html>
    `;

    const htmlContent = printFormat === "format1" ? format1 : format2;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  } catch (err) {
    console.error("Error printing salary slip:", err);
    alert("Failed to generate salary slip. Check console for details.");
  }
};


  const numToWords = (num) => {
    const a = [
      "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
      "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
    ];
    const b = [
      "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
    ];
    if ((num = num.toString()).length > 9) return "Overflow";
    const n = ("000000000" + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;
    let str = "";
    str += n[1] != 0 ? (a[Number(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + " Crore " : "";
    str += n[2] != 0 ? (a[Number(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + " Lakh " : "";
    str += n[3] != 0 ? (a[Number(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + " Thousand " : "";
    str += n[4] != 0 ? (a[Number(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + " Hundred " : "";
    str += n[5] != 0 ? (str != "" ? "and " : "") + (a[Number(n[5])] || b[n[5][0]] + " " + a[n[5][1]]) + " " : "";
    return str.trim();
  };

  return (
    <div className="flex items-center gap-2">
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        onClick={handleSalaryPrint}
      >
        Print Salary Slip
      </button>
      <Select
        defaultValue="format1"
        style={{ width: 120 }}
        onChange={(value) => setPrintFormat(value)}
      >
        <Option value="format1">Format 1</Option>
        <Option value="format2">Format 2</Option>
      </Select>
    </div>
  );
};

export default SalarySlipPrint;
