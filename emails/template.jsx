import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "react-email";
import * as React from "react";

export default function EmailTemplate({
  userName = "",
  type = "budget-alert",
  data = {},
}) {
  if (type === "monthly-report") {
  }
  if (type === "budget-alert") {
    return (
      <Html>
        <Head />
        <Preview>Предупреждение по бюджету</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>Предупреждение</Heading>
            <Text style={styles.text}>Здравствуйте, {userName},</Text>
            <Text style={styles.text}>
              Вы использовали {data?.percentageUsed.toFixed(1)}% от месячного
              бюджета.
            </Text>
            <Section style={styles.statsContainer}>
              <div style={styles.stat}>
                <Text style={styles.text}>Сумма бюджета</Text>
                <Text style={styles.heading}>{data?.budgetAmount} ₽</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Уже потрачено</Text>
                <Text style={styles.heading}>{data?.totalExpenses} ₽</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Осталось</Text>
                <Text style={styles.heading}>
                  {data?.budgetAmount - data?.totalExpenses} ₽
                </Text>
              </div>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  }

  if (type === "goal-reminder") {
    return (
      <Html>
        <Head />
        <Preview>Ежемесячный отчёт по финансовым целям</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>Отчёт по целям</Heading>
            <Text style={styles.text}>Здравствуйте, {userName},</Text>
            <Text style={styles.text}>
              Вот статус ваших финансовых целей на этот месяц:
            </Text>
            <Section style={styles.statsContainer}>
              {data?.goals?.map((goal, index) => (
                <div key={index} style={styles.stat}>
                  <Text style={styles.heading}>{goal.name}</Text>
                  <Text style={styles.text}>
                    Прогресс: {goal.progressPercent}%
                  </Text>
                  <Text style={styles.text}>
                    Нужно откладывать:{" "}
                    {goal.requiredMonthly.toLocaleString("ru-RU")} ₽ в месяц
                  </Text>
                  <Text
                    style={
                      goal.isFeasible ? styles.feasible : styles.notFeasible
                    }
                  >
                    {goal.isFeasible
                      ? "✅ Цель достижима при текущем доходе"
                      : "⚠️ Требуется сократить расходы"}
                  </Text>
                </div>
              ))}
            </Section>
            <Text style={styles.footer}>
              Откройте приложение, чтобы отложить нужную сумму.
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }
}

const styles = {
  body: {
    backgroundColor: "#f6f9fc",
    fontFamily: "-apple-system, sans-serif",
  },
  container: {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  title: {
    color: "#1f2937",
    fontSize: "32px",
    fontWeight: "bold",
    textAlign: "center",
    margin: "0 0 20px",
  },
  heading: {
    color: "#1f2937",
    fontSize: "20px",
    fontWeight: "600",
    margin: "0 0 16px",
  },
  text: {
    color: "#4b5563",
    fontSize: "16px",
    margin: "0 0 16px",
  },
  section: {
    marginTop: "32px",
    padding: "20px",
    backgroundColor: "#f9fafb",
    borderRadius: "5px",
    border: "1px solid #e5e7eb",
  },
  statsContainer: {
    margin: "32px 0",
    padding: "20px",
    backgroundColor: "#f9fafb",
    borderRadius: "5px",
  },
  stat: {
    marginBottom: "16px",
    padding: "12px",
    backgroundColor: "#fff",
    borderRadius: "4px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid #e5e7eb",
  },
  footer: {
    color: "#6b7280",
    fontSize: "14px",
    textAlign: "center",
    marginTop: "32px",
    paddingTop: "16px",
    borderTop: "1px solid #e5e7eb",
  },
};
