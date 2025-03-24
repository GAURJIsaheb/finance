import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text } from "@react-email/components";
import * as React from "react";

export default function Email({
    userName = "",
    type = "budget-alert",
    data = {}
}) {
    if (type === "monthly-report") {
        const netAmount = data?.stats.totalIncome - data?.stats.totalExpenses;
        return (
            <Html>
                <Head />
                <Preview>Your {data?.month} Financial Report | Welth</Preview>
                <Body style={styles.body}>
                    <Container style={styles.container}>
                        {/* Header */}
                        <Section style={styles.header}>
                            <Heading style={styles.title}>
                                {data?.month} Financial Report
                            </Heading>
                            <Text style={styles.subtitle}>
                                Welth • {new Date().toLocaleDateString()}
                            </Text>
                        </Section>

                        {/* Content */}
                        <Section style={styles.content}>
                            <Text style={styles.greeting}>Hello {userName},</Text>
                            <Text style={styles.text}>
                                Your monthly financial overview for {data?.month} is ready. 
                                Here's a snapshot of your financial performance:
                            </Text>

                            {/* Main Stats */}
                            <Section style={styles.statsContainer}>
                                <div style={styles.statCard}>
                                    <Text style={styles.statLabel}>Total Income</Text>
                                    <Text style={styles.statValue}>
                                        ${data?.stats.totalIncome.toLocaleString()}
                                    </Text>
                                </div>
                                <div style={styles.statCard}>
                                    <Text style={styles.statLabel}>Total Expenses</Text>
                                    <Text style={styles.statValue}>
                                        ${data?.stats.totalExpenses.toLocaleString()}
                                    </Text>
                                </div>
                                <div style={{
                                    ...styles.statCard,
                                    backgroundColor: netAmount >= 0 ? '#e6ffe6' : '#ffe6e6'
                                }}>
                                    <Text style={styles.statLabel}>Net Amount</Text>
                                    <Text style={{
                                        ...styles.statValue,
                                        color: netAmount >= 0 ? '#006600' : '#cc0000'
                                    }}>
                                        ${netAmount.toLocaleString()}
                                    </Text>
                                </div>
                            </Section>

                            {/* Category Breakdown */}
                            {data?.stats?.byCategory && (
                                <Section style={styles.section}>
                                    <Heading style={styles.sectionTitle}>Expense Breakdown</Heading>
                                    <div style={styles.categoryContainer}>
                                        {Object.entries(data.stats.byCategory).map(([category, amount]) => (
                                            <div key={category} style={styles.categoryRow}>
                                                <Text style={styles.categoryLabel}>
                                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                                </Text>
                                                <Text style={styles.categoryValue}>
                                                    ${amount.toLocaleString()}
                                                </Text>
                                            </div>
                                        ))}
                                    </div>
                                </Section>
                            )}

                            {/* Footer */}
                            <Section style={styles.footer}>
                                <Text style={styles.footerText}>
                                    Thank you for choosing Welth. For detailed analysis or support, 
                                    reply to this email or contact us at{' '}
                                    <a href="www.linkedin.com/in/adityagaur01" style={styles.link}>
                                        support@welth.com
                                    </a>
                                </Text>
                                <Text style={styles.footerSubtext}>
                                    © {new Date().getFullYear()} Welth. All rights reserved.
                                </Text>
                            </Section>
                        </Section>
                    </Container>
                </Body>
            </Html>
        );
    }
    if (type === "budget-alert") {
        // template for budget-report
        return (
            <Html>
                <Head />
                <Preview>Budget Alert - Action Required</Preview>
                <Body style={styles.body}>
                    <Container style={styles.container}>
                        <Section style={styles.header}>
                            <Heading style={styles.title}>Budget Alert</Heading>
                        </Section>
    
                        <Section style={styles.content}>
                            <Text style={styles.greeting}>Hello {userName},</Text>
                            <Text style={styles.text}>
                                Your budget requires attention. You’ve utilized {data?.percentageUsed?.toFixed(1)}% 
                                of your monthly allocation.
                            </Text>
    
                            <Section style={styles.statsContainer}>
                                <div style={styles.stat}>
                                    <Text style={styles.label}>Budget Amount</Text>
                                    <Text style={styles.value}>${data?.budgetAmount?.toLocaleString()}</Text>
                                </div>
    
                                <div style={styles.stat}>
                                    <Text style={styles.label}>Spent So Far</Text>
                                    <Text style={styles.value}>${data?.totalExpense?.toLocaleString()}</Text>
                                </div>
    
                                <div style={styles.stat}>
                                    <Text style={styles.label}>Remaining</Text>
                                    <Text style={styles.value}>
                                        ${((data?.budgetAmount || 0) - (data?.totalExpense || 0)).toLocaleString()}
                                    </Text>
                                </div>
                            </Section>
    
                            <Section style={styles.footer}>
                                <Text style={styles.footerText}>
                                    Need to adjust your budget? Contact your account manager or reply to this email.
                                </Text>
                            </Section>
                        </Section>
                    </Container>
                </Body>
            </Html>
        );
    }


}

const styles = {
    body: {
        backgroundColor: "#f5f7fa",
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        margin: 0,
        padding: "20px",
    },
    container: {
        maxWidth: "640px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
    },
    header: {
        background: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
        padding: "30px 20px",
        textAlign: "center",
    },
    title: {
        color: "#ffffff",
        fontSize: "28px",
        fontWeight: "700",
        margin: 0,
        lineHeight: "1.2",
    },
    subtitle: {
        color: "rgba(255, 255, 255, 0.8)",
        fontSize: "14px",
        marginTop: "8px",
    },
    content: {
        padding: "40px",
    },
    greeting: {
        fontSize: "20px",
        color: "#1a1a1a",
        fontWeight: "600",
        marginBottom: "20px",
    },
    text: {
        fontSize: "16px",
        color: "#4a5568",
        lineHeight: "1.6",
        marginBottom: "24px",
    },
    statsContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "16px",
        marginBottom: "32px",
    },
    statCard: {
        backgroundColor: "#f8fafc",
        padding: "16px",
        borderRadius: "8px",
        textAlign: "center",
    },
    statLabel: {
        fontSize: "14px",
        color: "#6b7280",
        fontWeight: "500",
        marginBottom: "8px",
    },
    statValue: {
        fontSize: "20px",
        color: "#1a1a1a",
        fontWeight: "700",
    },
    section: {
        marginBottom: "32px",
    },
    sectionTitle: {
        fontSize: "18px",
        color: "#1e3a8a",
        fontWeight: "600",
        marginBottom: "16px",
    },
    categoryContainer: {
        backgroundColor: "#f8fafc",
        padding: "20px",
        borderRadius: "8px",
    },
    categoryRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 0",
        borderBottom: "1px solid #edf2f7",
    },
    categoryLabel: {
        fontSize: "15px",
        color: "#4a5568",
        fontWeight: "500",
    },
    categoryValue: {
        fontSize: "15px",
        color: "#2d3748",
        fontWeight: "600",
    },
    footer: {
        borderTop: "1px solid #e2e8f0",
        paddingTop: "24px",
        textAlign: "center",
    },
    footerText: {
        fontSize: "13px",
        color: "#6b7280",
        lineHeight: "1.5",
        marginBottom: "8px",
    },
    footerSubtext: {
        fontSize: "12px",
        color: "#9ca3af",
    },
    link: {
        color: "#3b82f6",
        textDecoration: "none",
        fontWeight: "500",
    }
};