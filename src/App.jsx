import { useState } from "react";
import jsPDF from "jspdf";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const cardStyle = {
  background: "white",
  padding: "15px",
  borderRadius: "15px",
  textAlign: "center",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "12px",
  borderRadius: "12px",
  border: "2px solid #d1d5db",
  fontSize: "15px",
  color: "#111827",
  background: "#ffffff",
  boxSizing: "border-box",
  outline: "none",
};

function App() {
  const [income, setIncome] = useState("");
  const [rent, setRent] = useState("");
  const [food, setFood] = useState("");
  const [travel, setTravel] = useState("");
  const [entertainment, setEntertainment] = useState("");

  const [goalName, setGoalName] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [goalMonths, setGoalMonths] = useState("");

  const [result, setResult] = useState(null);
  const [aiAdvice, setAiAdvice] = useState("");

  const analyzeFinance = () => {
    const totalExpenses =
      Number(rent) +
      Number(food) +
      Number(travel) +
      Number(entertainment);

    const remaining = Number(income) - totalExpenses;

    const savingsRate =
      income > 0
        ? ((remaining / Number(income)) * 100).toFixed(1)
        : 0;

    let score = 100;

    if (Number(rent) > Number(income) * 0.4)
      score -= 20;

    if (Number(food) > Number(income) * 0.2)
      score -= 10;

    if (Number(entertainment) > Number(income) * 0.1)
      score -= 15;

    if (remaining < Number(income) * 0.2)
      score -= 20;

    if (score < 0) score = 0;

    let rating = "";

    if (score >= 80) {
      rating = "🟢 Excellent";
    } else if (score >= 60) {
      rating = "🟡 Good";
    } else {
      rating = "🔴 Needs Improvement";
    }

    const monthlySavingNeeded =
      goalMonths > 0
        ? (
            Number(goalAmount) /
            Number(goalMonths)
          ).toFixed(0)
        : 0;

    const goalAchievable =
            Number(remaining) >=
            Number(monthlySavingNeeded);

    const expenses = [
            { name: "Rent", value: Number(rent) },
            { name: "Food", value: Number(food) },
            { name: "Travel", value: Number(travel) },
            {
              name: "Entertainment",
              value: Number(entertainment),
            },
          ];

          const highestExpense = expenses.reduce((a, b) =>
            a.value > b.value ? a : b
          );

          let rentStatus =
            Number(rent) > Number(income) * 0.4
              ? "🔴 Rent Too High"
              : "🟢 Rent Healthy";

          let foodStatus =
            Number(food) > Number(income) * 0.2
              ? "🟡 Food Slightly High"
              : "🟢 Food Healthy";

          let entertainmentStatus =
            Number(entertainment) > Number(income) * 0.1
              ? "🔴 Entertainment Too High"
              : "🟢 Entertainment Healthy";

    setResult({
      totalExpenses,
      remaining,
      savingsRate,
      score,
      rating,
      monthlySavingNeeded,
      goalAchievable,
      highestExpense,
      rentStatus,
      foodStatus,
      entertainmentStatus,
      emergencyFund: Number(income) * 6,
    }); 

    let advice =
      "📈 FINANCIAL ANALYSIS REPORT\n\n";

        advice += `Income: ₹${income}\n`;
        advice += `Expenses: ₹${totalExpenses}\n`;
        advice += `Savings: ₹${remaining}\n\n`;

    if (Number(entertainment) > Number(income) * 0.1) {
      advice +=
        " Warning:  Entertainment spending is higher than recommended.\n\n";
    }

    if (Number(rent) > Number(income) * 0.4) {
      advice +=
        " Rent is consuming a large portion of your income.\n\n";
    }

    if (Number(food) > Number(income) * 0.2) {
      advice +=
        " Food expenses are slightly high. Consider meal budgeting.\n\n";
    }

    if (remaining > 0) {
      advice += ` Potential Monthly Savings: ₹${remaining}\n\n`;
    } else {
      advice +=
        " Expenses exceed income. Reduce spending immediately.\n\n";
    }

    advice += ` Recommended Emergency Fund: ₹${
      Number(income) * 6
    }\n\n`;

    advice +=
      "Invest a portion of your savings monthly to build long-term wealth.";

    setAiAdvice(advice);
  };
   const downloadReport = () => {
    if (!result) return;

    const doc = new jsPDF();

    // -----------------------
    // Header
    // -----------------------

    doc.setFontSize(22);
    doc.text("AI Personal Finance Report", 20, 20);

    const today = new Date().toLocaleDateString();

    doc.setFontSize(10);
    doc.text(`Generated on: ${today}`, 20, 32);
    doc.text("Prepared By: Harshita Jain", 20, 38);

    doc.setDrawColor(106, 17, 203);
    doc.line(20, 25, 190, 25);

    // -----------------------
    // Calculate Rating FIRST
    // -----------------------

    let rating = "";

    if (result.score >= 80) {
      rating = "Excellent";
    } else if (result.score >= 60) {
      rating = "Good";
    } else {
      rating = "Needs Improvement";
    }

    // -----------------------
    // Main Stats
    // -----------------------

    doc.setFontSize(12);

    doc.text(`Monthly Income: Rs. ${income}`, 20, 50);

    doc.text(
      `Total Expenses: Rs. ${result.totalExpenses}`,
      20,
      60
    );

    doc.text(
      `Remaining Money: Rs. ${result.remaining}`,
      20,
      70
    );

    doc.text(
      `Savings Rate: ${result.savingsRate}%`,
      20,
      80
    );

    doc.text(
      `Health Score: ${result.score}/100`,
      20,
      90
    );

    doc.text(
      `Financial Rating: ${rating}`,
      20,
      100
    );

    // -----------------------
    // Summary Card
    // -----------------------

    doc.setDrawColor(106, 17, 203);

    doc.roundedRect(
      120,
      40,
      60,
      50,
      3,
      3
    );

    doc.setFontSize(11);

    doc.text("Savings Rate", 125, 52);
    doc.text(`${result.savingsRate}%`, 125, 64);

    doc.text("Score", 125, 78);
    doc.text(`${result.score}/100`, 125, 88);

    // -----------------------
    // Rating Badge
    // -----------------------

    if (rating === "Excellent") {
      doc.setFillColor(16, 185, 129);
    } else if (rating === "Good") {
      doc.setFillColor(245, 158, 11);
    } else {
      doc.setFillColor(239, 68, 68);
    }

    doc.roundedRect(
      120,
      95,
      50,
      12,
      3,
      3,
      "F"
    );

    doc.setTextColor(255, 255, 255);

    doc.text(
      rating,
      128,
      103
    );

    doc.setTextColor(0, 0, 0);

    // -----------------------
    // Goal Planning Header
    // -----------------------

    doc.setFillColor(106, 17, 203);

    doc.rect(
      15,
      115,
      180,
      10,
      "F"
    );

    doc.setTextColor(
      255,
      255,
      255
    );

    doc.setFontSize(14);

    doc.text(
      "GOAL PLANNING",
      20,
      122
    );

    doc.setTextColor(0, 0, 0);

    // -----------------------
    // Goal Planning Content
    // -----------------------

    doc.setFontSize(12);

    doc.text(
      `Goal: ${goalName || "Not Specified"}`,
      20,
      138
    );

    doc.text(
      `Goal Amount: Rs. ${goalAmount || 0}`,
      20,
      148
    );

    doc.text(
      `Required Monthly Savings: Rs. ${result.monthlySavingNeeded}`,
      20,
      158
    );

    // -----------------------
    // AI Advice Section
    // -----------------------

    doc.setFontSize(16);

    doc.text(
      "AI Financial Advice",
      20,
      175
    );

    doc.setFontSize(12);

    const cleanAdvice = aiAdvice.replace(
      /[^\x00-\x7F]/g,
      ""
    );

    const adviceLines = doc.splitTextToSize(
      cleanAdvice,
      170
    );

    let y = 185;

    adviceLines.forEach((line) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }

      doc.text(line, 20, y);
      y += 7;
    });

    // -----------------------
    // Footer
    // -----------------------

    const totalPages = doc.getNumberOfPages();

    doc.setPage(totalPages);

    doc.setFontSize(9);

    doc.text(
      "Generated by AI Personal Finance Assistant",
      20,
      285
    );

    doc.save("Finance_Report.pdf");
  };

  const chartData = [
    {
      name: "Rent",
      value: Number(rent) || 0,
    },
    {
      name: "Food",
      value: Number(food) || 0,
    },
    {
      name: "Travel",
      value: Number(travel) || 0,
    },
    {
      name: "Entertainment",
      value: Number(entertainment) || 0,
    },
  ];

  const COLORS = [
    "#6a11cb",
    "#2575fc",
    "#00c49f",
    "#ff8042",
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#6a11cb,#2575fc)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          width: "700px",
          maxWidth: "95%",
          padding: "30px",
          borderRadius: "20px",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.2)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            background: "linear-gradient(90deg,#6a11cb,#2575fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: "42px",
            fontWeight: "800",
            marginBottom: "30px",
            lineHeight: "1",
          }}
        >
          AI Personal Finance
          <br />
          Assistant
        </h1>
        <p
          style={{
            textAlign: "center",
            color: "#6B7280",
            marginTop: "-10px",
            marginBottom: "25px",
            fontSize: "15px",
          }}
        >
          AI-Powered Financial Analysis & Goal Planning System
        </p>
                <input
          type="number"
          min="0"
          placeholder="Monthly Income"
          value={income}
          onChange={(e) =>
            setIncome(e.target.value)
          }
          style={inputStyle}
        />

        <input
          type="number"
          min="0"
          placeholder="Rent"
          value={rent}
          onChange={(e) =>
            setRent(e.target.value)
          }
          style={inputStyle}
        />

        <input
          type="number"
          min="0"
          placeholder="Food"
          value={food}
          onChange={(e) =>
            setFood(e.target.value)
          }
          style={inputStyle}
        />

        <input
          type="number"
          min="0"
          placeholder="Travel"
          value={travel}
          onChange={(e) =>
            setTravel(e.target.value)
          }
          style={inputStyle}
        />

        <input
          type="number"
          min="0"
          placeholder="Entertainment"
          value={entertainment}
          onChange={(e) =>
            setEntertainment(e.target.value)
          }
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="🎯 Dream Goal"
          value={goalName}
          onChange={(e) =>
            setGoalName(e.target.value)
          }
          style={inputStyle}
        />

        <input
          type="number"
          min="0"
          placeholder="💰 Goal Amount"
          value={goalAmount}
          onChange={(e) =>
            setGoalAmount(e.target.value)
          }
          style={inputStyle}
        />

        <input
          type="number"
          min="0"
          placeholder="📅 Target Months"
          value={goalMonths}
          onChange={(e) =>
            setGoalMonths(e.target.value)
          }
          style={inputStyle}
        />

        <button
          onClick={analyzeFinance}

          style={{
            width: "100%",
            padding: "14px",
            marginTop: "15px",
            border: "none",
            borderRadius: "10px",
            background:
              "linear-gradient(135deg,#6a11cb,#2575fc)",
            fontWeight: "700",
            fontSize: "17px",
            transition: "0.3s",
            color: "white",
            cursor: "pointer",
          }}
        >
          Analyze Finances
        </button>

{result && (
  <div
    style={{
      marginTop: "20px",
      padding: "20px",
      borderRadius: "15px",
      background: "#f3f4f6",
    }}
  >
    {/* Dashboard Cards */}

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "15px",
        marginBottom: "20px",
      }}
    >
    <div style={cardStyle}>
      <h4
        style={{
          color: "#6B7280",
          marginBottom: "8px",
        }}
      >
        Total Expenses
      </h4>

      <h2
        style={{
          color: "#141b2a",
          fontWeight: "600",
          fontSize: "20px",
          margin: 0,
        }}
      >
        ₹{result.totalExpenses}
      </h2>
    </div>

    <div style={cardStyle}>
      <h4
        style={{
          color: "#6B7280",
          marginBottom: "8px",
        }}
      >
        Remaining Money
      </h4>

      <h2
        style={{
          color: "#141b2a",
          fontWeight: "600",
          fontSize: "20px",
          margin: 0,
        }}
      >
        ₹{result.remaining}
      </h2>
    </div>


      <div style={cardStyle}>
        <h4
          style={{
            color: "#6B7280",
            marginBottom: "8px",
          }}
        >
          Savings Rate
        </h4>

        <h2
          style={{
            color: "#141b2a",
            fontWeight: "600",
            fontSize: "20px",
            margin: 0,
          }}
        >
          {result.savingsRate}%
        </h2>
      </div>

    
        <div style={cardStyle}>
      <h4
        style={{
          color: "#6B7280",
          marginBottom: "8px",
        }}
      >
        Health Score
      </h4>

      <h2
        style={{
          color: "#141b2a",
          fontWeight: "600",
          fontSize: "20px",
          margin: 0,
        }}
      >
        {result.score}/100
      </h2>

</div>
      <div style={cardStyle}>
        <h4>
          Emergency Fund
        </h4>

  <h2
        style={{
          color: "#141b2a",
          fontWeight: "600",
          fontSize: "20px",
          margin: 0,
        }}
      >
        {result.emergencyFund}/100
      </h2>

  </div>

  <div
  style={{
    background: "white",
    padding: "15px",
    borderRadius: "15px",
    marginBottom: "20px",
  }}
>
  <h3>📑 Financial Summary</h3>

  <p>Monthly Income: ₹{income}</p>

  <p>
    Monthly Expenses: ₹
    {result.totalExpenses}
  </p>

  <p>
    Net Savings: ₹{result.remaining}
  </p>

  <p>
    Financial Rating:
    {result.rating}
  </p>
</div>
  
    <button
      onClick={downloadReport}
      style={{
        width: "100%",
        marginTop: "20px",
        padding: "14px",
        border: "none",
        borderRadius: "10px",
        background: "#10b981",
        color: "white",
        fontSize: "16px",
        fontWeight: "700",
        cursor: "pointer",
      }}
    >
      📄 Download Financial Report
    </button>
</div>


    {/* Budget Status */}

    <div
      style={{
        background: "white",
        padding: "15px",
        borderRadius: "15px",
        marginBottom: "20px",
      }}
    >
      <h3>📋 Budget Status</h3>

      <p>{result.rentStatus}</p>
      <p>{result.foodStatus}</p>
      <p>{result.entertainmentStatus}</p>
    </div>

    <div
      style={{
        background: "white",
        padding: "15px",
        borderRadius: "15px",
        marginBottom: "20px",
      }}
    >
      <h3>📊 Highest Expense</h3>

      <p>
        {result.highestExpense.name} : ₹
        {result.highestExpense.value}
      </p>
    </div>

    {aiAdvice && (
      <div
        style={{
          marginTop: "15px",
          padding: "15px",
          borderRadius: "12px",
          background: "#eef2ff",
          whiteSpace: "pre-line",
        }}
      >
        <h3 style={{ color: "#6a11cb" }}>
          🤖 AI Financial Advice
        </h3>

        <p>{aiAdvice}</p>
      </div>
    )}

    {/* Pie Chart */}

    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "20px",
      }}
    >
      <PieChart width={350} height={300}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          dataKey="value"
          label={({ name }) => name}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>
    </div>

    {/* Goal Planner */}

    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "15px",
        marginTop: "20px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ color: "#6a11cb" }}>
        🎯 Goal Planner
      </h2>

      <p>
        <strong>Goal:</strong> {goalName}
      </p>

      <p>
        <strong>Goal Amount:</strong> ₹{goalAmount}
      </p>

      <p>
        <strong>Duration:</strong> {goalMonths} Months
      </p>

      <h3
        style={{
          color:
            Number(result.monthlySavingNeeded) <=
            Number(result.remaining)
              ? "green"
              : "red",
        }}
      >
        💰 Save ₹{result.monthlySavingNeeded}/month
      </h3>

      <p
        style={{
          fontWeight: "bold",
          color: result.goalAchievable ? "green" : "red",
        }}
      >
        {result.goalAchievable
          ? "✅ Goal Achievable"
          : "❌ Goal Not Achievable"}
</p>
    </div>
  </div>
)}

   </div>
    </div>
  );
}


export default App;