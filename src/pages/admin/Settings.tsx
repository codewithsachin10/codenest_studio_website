import { useState } from "react";
import { motion } from "framer-motion";
import {
    Settings,
    User,
    Lock,
    Bell,
    Palette,
    Globe,
    Database,
    Shield,
    Mail,
    Save,
    Eye,
    EyeOff,
    Check,
    Moon,
    Sun,
    Monitor,
    ChevronRight,
    ExternalLink,
    AlertTriangle,
    Trash2,
    RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const SettingsPage = () => {
    // Profile settings
    const [profile, setProfile] = useState({
        name: "Admin User",
        email: "admin@codenest.app",
        bio: "CodeNest Studio administrator",
    });

    // Security settings
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [passwords, setPasswords] = useState({
        current: "",
        new: "",
        confirm: "",
    });
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

    // Notification settings
    const [notifications, setNotifications] = useState({
        emailNewSubscriber: true,
        emailNewDownload: false,
        emailWeeklyReport: true,
        pushNewTestimonial: true,
        pushSystemAlerts: true,
    });

    // Appearance settings
    const [theme, setTheme] = useState<"light" | "dark" | "system">("system");

    // SEO settings
    const [seo, setSeo] = useState({
        siteTitle: "CodeNest Studio - Offline Code Editor",
        siteDescription: "The ultimate offline code editor with built-in compilers for Python, Java, C++, and more.",
        socialImage: "/og-image.png",
    });

    // Danger zone
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [resetDialog, setResetDialog] = useState(false);

    const handleSaveProfile = () => {
        toast.success("Profile saved successfully");
    };

    const handleChangePassword = () => {
        if (passwords.new !== passwords.confirm) {
            toast.error("Passwords don't match");
            return;
        }
        toast.success("Password changed successfully");
        setPasswords({ current: "", new: "", confirm: "" });
    };

    const handleSaveNotifications = () => {
        toast.success("Notification preferences saved");
    };

    const handleSaveSEO = () => {
        toast.success("SEO settings saved");
    };

    const SettingsSection = ({
        icon: Icon,
        title,
        description,
        children,
    }: {
        icon: React.ElementType;
        title: string;
        description: string;
        children: React.ReactNode;
    }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden"
        >
            <div className="p-6 border-b border-border/50 bg-muted/20">
                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-primary/10 p-2.5">
                        <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-foreground">{title}</h2>
                        <p className="text-sm text-muted-foreground">{description}</p>
                    </div>
                </div>
            </div>
            <div className="p-6">{children}</div>
        </motion.div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-3xl font-bold text-foreground flex items-center gap-3"
                >
                    <div className="rounded-xl bg-primary/10 p-2">
                        <Settings className="h-6 w-6 text-primary" />
                    </div>
                    Settings
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="text-muted-foreground mt-1"
                >
                    Manage your admin panel preferences
                </motion.p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <TabsList className="h-auto flex-wrap bg-muted/30 p-1 gap-1">
                        {[
                            { value: "profile", icon: User, label: "Profile" },
                            { value: "security", icon: Lock, label: "Security" },
                            { value: "notifications", icon: Bell, label: "Notifications" },
                            { value: "appearance", icon: Palette, label: "Appearance" },
                            { value: "seo", icon: Globe, label: "SEO" },
                            { value: "danger", icon: AlertTriangle, label: "Danger Zone" },
                        ].map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className={cn(
                                    "gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm",
                                    tab.value === "danger" && "data-[state=active]:text-destructive"
                                )}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </motion.div>

                {/* Profile Tab */}
                <TabsContent value="profile" className="space-y-6">
                    <SettingsSection
                        icon={User}
                        title="Profile Information"
                        description="Update your personal information"
                    >
                        <div className="space-y-6">
                            <div className="flex items-center gap-6">
                                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shrink-0">
                                    <span className="text-3xl font-bold text-primary-foreground">
                                        {profile.name.charAt(0)}
                                    </span>
                                </div>
                                <div>
                                    <Button variant="outline" size="sm">
                                        Change Avatar
                                    </Button>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Recommended: 200x200px, PNG or JPG
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    rows={3}
                                    value={profile.bio}
                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                    placeholder="Tell us about yourself..."
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button onClick={handleSaveProfile} className="gap-2 bg-gradient-to-r from-primary to-primary/80">
                                    <Save className="h-4 w-4" />
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    </SettingsSection>
                </TabsContent>

                {/* Security Tab */}
                <TabsContent value="security" className="space-y-6">
                    <SettingsSection
                        icon={Lock}
                        title="Change Password"
                        description="Update your password to keep your account secure"
                    >
                        <div className="space-y-4 max-w-md">
                            <div className="space-y-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                <div className="relative">
                                    <Input
                                        id="current-password"
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={passwords.current}
                                        onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                                        className="pr-10"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    >
                                        {showCurrentPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="new-password"
                                        type={showNewPassword ? "text" : "password"}
                                        value={passwords.new}
                                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                                        className="pr-10"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        {showNewPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    value={passwords.confirm}
                                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                                />
                            </div>

                            <Button onClick={handleChangePassword} className="gap-2">
                                <Lock className="h-4 w-4" />
                                Update Password
                            </Button>
                        </div>
                    </SettingsSection>

                    <SettingsSection
                        icon={Shield}
                        title="Two-Factor Authentication"
                        description="Add an extra layer of security to your account"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-foreground">Enable 2FA</p>
                                <p className="text-sm text-muted-foreground">
                                    {twoFactorEnabled
                                        ? "Your account is protected with 2FA"
                                        : "Protect your account with an authenticator app"}
                                </p>
                            </div>
                            <Switch
                                checked={twoFactorEnabled}
                                onCheckedChange={setTwoFactorEnabled}
                            />
                        </div>
                    </SettingsSection>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications" className="space-y-6">
                    <SettingsSection
                        icon={Mail}
                        title="Email Notifications"
                        description="Choose what emails you want to receive"
                    >
                        <div className="space-y-4">
                            {[
                                { key: "emailNewSubscriber", label: "New Subscriber", description: "Get notified when someone subscribes" },
                                { key: "emailNewDownload", label: "New Download", description: "Get notified when someone downloads" },
                                { key: "emailWeeklyReport", label: "Weekly Report", description: "Receive a weekly analytics summary" },
                            ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between py-2">
                                    <div>
                                        <p className="font-medium text-foreground">{item.label}</p>
                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                    </div>
                                    <Switch
                                        checked={notifications[item.key as keyof typeof notifications]}
                                        onCheckedChange={(checked) =>
                                            setNotifications({ ...notifications, [item.key]: checked })
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    </SettingsSection>

                    <SettingsSection
                        icon={Bell}
                        title="Push Notifications"
                        description="Configure browser push notifications"
                    >
                        <div className="space-y-4">
                            {[
                                { key: "pushNewTestimonial", label: "New Testimonial", description: "When a new testimonial is submitted" },
                                { key: "pushSystemAlerts", label: "System Alerts", description: "Important system notifications" },
                            ].map((item) => (
                                <div key={item.key} className="flex items-center justify-between py-2">
                                    <div>
                                        <p className="font-medium text-foreground">{item.label}</p>
                                        <p className="text-sm text-muted-foreground">{item.description}</p>
                                    </div>
                                    <Switch
                                        checked={notifications[item.key as keyof typeof notifications]}
                                        onCheckedChange={(checked) =>
                                            setNotifications({ ...notifications, [item.key]: checked })
                                        }
                                    />
                                </div>
                            ))}

                            <div className="flex justify-end pt-4">
                                <Button onClick={handleSaveNotifications} className="gap-2">
                                    <Save className="h-4 w-4" />
                                    Save Preferences
                                </Button>
                            </div>
                        </div>
                    </SettingsSection>
                </TabsContent>

                {/* Appearance Tab */}
                <TabsContent value="appearance" className="space-y-6">
                    <SettingsSection
                        icon={Palette}
                        title="Theme"
                        description="Choose your preferred color scheme"
                    >
                        <div className="grid gap-4 sm:grid-cols-3">
                            {[
                                { value: "light", icon: Sun, label: "Light" },
                                { value: "dark", icon: Moon, label: "Dark" },
                                { value: "system", icon: Monitor, label: "System" },
                            ].map((option) => (
                                <motion.button
                                    key={option.value}
                                    type="button"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setTheme(option.value as typeof theme)}
                                    className={cn(
                                        "relative flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all",
                                        theme === option.value
                                            ? "border-primary bg-primary/5"
                                            : "border-border/50 hover:border-primary/30"
                                    )}
                                >
                                    {theme === option.value && (
                                        <div className="absolute top-2 right-2">
                                            <div className="rounded-full bg-primary p-1">
                                                <Check className="h-3 w-3 text-primary-foreground" />
                                            </div>
                                        </div>
                                    )}
                                    <div className={cn(
                                        "rounded-xl p-3",
                                        theme === option.value ? "bg-primary/10" : "bg-muted"
                                    )}>
                                        <option.icon className={cn(
                                            "h-6 w-6",
                                            theme === option.value ? "text-primary" : "text-muted-foreground"
                                        )} />
                                    </div>
                                    <span className={cn(
                                        "font-medium",
                                        theme === option.value ? "text-foreground" : "text-muted-foreground"
                                    )}>
                                        {option.label}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </SettingsSection>
                </TabsContent>

                {/* SEO Tab */}
                <TabsContent value="seo" className="space-y-6">
                    <SettingsSection
                        icon={Globe}
                        title="SEO Settings"
                        description="Configure search engine optimization"
                    >
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="site-title">Site Title</Label>
                                <Input
                                    id="site-title"
                                    value={seo.siteTitle}
                                    onChange={(e) => setSeo({ ...seo, siteTitle: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Recommended: 50-60 characters
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="site-description">Meta Description</Label>
                                <Textarea
                                    id="site-description"
                                    rows={3}
                                    value={seo.siteDescription}
                                    onChange={(e) => setSeo({ ...seo, siteDescription: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Recommended: 150-160 characters
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="social-image">Social Image URL</Label>
                                <Input
                                    id="social-image"
                                    value={seo.socialImage}
                                    onChange={(e) => setSeo({ ...seo, socialImage: e.target.value })}
                                    placeholder="/og-image.png"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Recommended: 1200x630px for optimal social media display
                                </p>
                            </div>

                            <div className="flex justify-end">
                                <Button onClick={handleSaveSEO} className="gap-2 bg-gradient-to-r from-primary to-primary/80">
                                    <Save className="h-4 w-4" />
                                    Save SEO Settings
                                </Button>
                            </div>
                        </div>
                    </SettingsSection>
                </TabsContent>

                {/* Danger Zone Tab */}
                <TabsContent value="danger" className="space-y-6">
                    <SettingsSection
                        icon={AlertTriangle}
                        title="Danger Zone"
                        description="Destructive actions that cannot be undone"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
                                <div>
                                    <p className="font-medium text-foreground flex items-center gap-2">
                                        <RefreshCw className="h-4 w-4 text-amber-500" />
                                        Reset Demo Data
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Reset all content to default demo data
                                    </p>
                                </div>
                                <Dialog open={resetDialog} onOpenChange={setResetDialog}>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10">
                                            Reset Data
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Reset Demo Data?</DialogTitle>
                                            <DialogDescription>
                                                This will reset all content (testimonials, FAQs, changelog, etc.) to their default demo values. This action cannot be undone.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setResetDialog(false)}>
                                                Cancel
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={() => {
                                                    toast.success("Demo data has been reset");
                                                    setResetDialog(false);
                                                }}
                                            >
                                                Reset Data
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl border border-destructive/20 bg-destructive/5">
                                <div>
                                    <p className="font-medium text-foreground flex items-center gap-2">
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                        Delete Account
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Permanently delete your admin account
                                    </p>
                                </div>
                                <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
                                    <DialogTrigger asChild>
                                        <Button variant="destructive">
                                            Delete Account
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                                            <DialogDescription>
                                                This action cannot be undone. This will permanently delete your admin account and remove all associated data.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <Button variant="outline" onClick={() => setDeleteDialog(false)}>
                                                Cancel
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                onClick={() => {
                                                    toast.error("Account deletion is disabled in demo mode");
                                                    setDeleteDialog(false);
                                                }}
                                            >
                                                Delete Account
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>
                    </SettingsSection>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default SettingsPage;
