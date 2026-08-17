"use client";
import React from "react";
import { Button } from "./ui/button";
import axios from "axios";
import { Crown, Sparkles } from "lucide-react";

type Props = { isPro: boolean };

const SubscriptionButton = (props: Props) => {
  const [loading, setLoading] = React.useState(false);
  const handleSubscription = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/stripe");
      window.location.href = response.data.url;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button
      disabled={loading}
      onClick={handleSubscription}
      className={
        props.isPro
          ? "w-full bg-secondary/60 hover:bg-secondary text-foreground border border-border/50 transition-all duration-200"
          : "w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-0 transition-all duration-300 glow-emerald-sm"
      }
    >
      {props.isPro ? (
        <>
          <Crown className="w-4 h-4 mr-2 text-emerald-400" />
          Manage Subscription
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4 mr-2" />
          Upgrade to Pro
        </>
      )}
    </Button>
  );
};

export default SubscriptionButton;
