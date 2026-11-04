import { Card, CardContent } from "@/components/ui/Card";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStatsCard from "@/components/profile/ProfileStatsCard";
import GoalSettingsCard from "@/components/profile/GoalSettingsCard";
import ProfileMenu from "@/components/profile/ProfileMenu";

export default function ProfilePage() {
  return (
    <div className="space-y-4 pb-14">
        <ProfileHeader />
        <ProfileStatsCard />
        <GoalSettingsCard />
        <ProfileMenu />
    </div>
  );
}