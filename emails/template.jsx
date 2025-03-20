import { Body, Button, Container, Head, Heading, Html, Preview, Section, Text } from "@react-email/components";
import * as React from "react";

export default function Email({
    userName = "",
    type = "budget-alert",
    data = {}
}) {
    if (type === "monthly-report") {
        // template for monthly-report
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
        backgroundColor: "#baec7b",
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        margintop: 20,
        padding: 0,
    },
    container: {
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    header: {
        backgroundColor: "#007bff",
        padding: "20px",
        textAlign: "center",
    },
    title: {
        color: "#ffffff",
        fontSize: "24px",
        fontWeight: "600",
        margin: 0,
    },
    content: {
        padding: "30px",
    },
    greeting: {
        fontSize: "18px",
        color: "#333333",
        marginBottom: "20px",
        fontWeight: "500",
    },
    text: {
        fontSize: "16px",
        color: "#666666",
        lineHeight: "24px",
        marginBottom: "20px",
    },
    statsContainer: {
        backgroundColor: "#f8f9fa",
        padding: "20px",
        borderRadius: "6px",
        marginBottom: "20px",
    },
    stat: {
        marginBottom: "15px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    label: {
        fontSize: "14px",
        color: "#666666",
        fontWeight: "500",
    },
    value: {
        fontSize: "16px",
        color: "#333333",
        fontWeight: "600",
    },
    footer: {
        borderTop: "1px solid #eee",
        paddingTop: "20px",
    },
    footerText: {
        fontSize: "14px",
        color: "#888888",
        lineHeight: "20px",
        textAlign: "center",
    }
};