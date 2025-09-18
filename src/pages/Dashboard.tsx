import React, { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Package, Heart, Settings, LogOut, ArrowLeft, CreditCard, MapPin, Bell, Lock, Calendar, Phone } from 'lucide-react';
import { ChangePasswordModal } from '@/components/ChangePasswordModal';
import { NotificationPreferencesModal } from '@/components/NotificationPreferencesModal';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import WishlistItems from '@/components/wishlist/WishlistItems';

const Dashboard = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profile');
    const [isLoading, setIsLoading] = useState(false);
    
    // Ensure user is logged in
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);
    
    const handleLogout = useCallback(async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Failed to log out', error);
            toast({
                title: 'Error',
                description: 'Failed to log out. Please try again.',
                variant: 'destructive',
            });
        }
    }, [logout, navigate]);

    // Sample data - in a real app, this would come from your backend
    const [profile, setProfile] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        dob: '',
        avatar: '',
        communicationPrefs: {
            email: true,
            sms: false,
            push: true
        }
    });

    const [addresses, setAddresses] = useState([
        {
            id: 1,
            type: 'shipping',
            street: '123 Osu Oxford Street',
            city: 'Accra',
            region: 'Greater Accra',
            landmark: 'Near Accra Mall',
            gps: 'GA-123-4567',
            isDefault: true
        },
        {
            id: 2,
            type: 'billing',
            company: 'ABC Company',
            street: '456 Spintex Road',
            city: 'Tema',
            region: 'Greater Accra',
            landmark: 'Opposite Shell Station',
            gps: 'GA-789-0123',
            isDefault: false
        }
    ]);

    const [paymentMethods, setPaymentMethods] = useState([
        {
            id: 1,
            type: 'card',
            last4: '4242',
            exp: '12/25',
            isDefault: true
        }
    ]);

    const handleBack = () => navigate(-1);
    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            // In a real app, you would make an API call to update the user's profile
            // For example:
            // await updateUserProfile(profile);
            
            toast({
                title: 'Success!',
                description: 'Your profile has been updated.',
            });
            
        } catch (error) {
            console.error('Error updating profile:', error);
            toast({
                title: 'Error',
                description: 'Failed to update profile. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="container mx-auto max-w-6xl">
                <Button
                    variant="ghost"
                    onClick={handleBack}
                    className="mb-6 flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Shop
                </Button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <img 
                            src="/src/assets/favicon.ico" 
                            alt="Logo" 
                            className="w-10 h-10 object-contain"
                        />
                        <div>
                            <h1 className="text-3xl font-serif">My Account</h1>
                            <p className="text-muted-foreground">Welcome back, {user.name}</p>
                        </div>
                    </div>
                    <Button variant="outline" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </Button>
                </div>

                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-8">
                        <TabsTrigger value="profile" onClick={() => setActiveTab('profile')}>
                            <User className="w-4 h-4 mr-2" />
                            Profile
                        </TabsTrigger>
                        <TabsTrigger value="addresses" onClick={() => setActiveTab('addresses')}>
                            <MapPin className="w-4 h-4 mr-2" />
                            Addresses
                        </TabsTrigger>
                        <TabsTrigger value="payments" onClick={() => setActiveTab('payments')}>
                            <CreditCard className="w-4 h-4 mr-2" />
                            Payments
                        </TabsTrigger>
                        <TabsTrigger value="orders" onClick={() => setActiveTab('orders')}>
                            <Package className="w-4 h-4 mr-2" />
                            Orders
                        </TabsTrigger>
                        <TabsTrigger value="wishlist" onClick={() => setActiveTab('wishlist')}>
                            <Heart className="w-4 h-4 mr-2" />
                            Wishlist
                        </TabsTrigger>
                        <TabsTrigger value="settings" onClick={() => setActiveTab('settings')}>
                            <Settings className="w-4 h-4 mr-2" />
                            Settings
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile">
                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>
                                    Update your personal information and manage how we communicate with you.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleProfileUpdate} className="space-y-6">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1 space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Full Name</Label>
                                                <Input id="name" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input id="email" type="email" value={profile.email} disabled />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="phone">
                                                    <Phone className="inline w-4 h-4 mr-2" />
                                                    Phone Number
                                                </Label>
                                                <Input id="phone" type="tel" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="dob">
                                                    <Calendar className="inline w-4 h-4 mr-2" />
                                                    Date of Birth
                                                </Label>
                                                <Input id="dob" type="date" value={profile.dob} onChange={(e) => setProfile({...profile, dob: e.target.value})} />
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                                {profile.avatar ? (
                                                    <img src={profile.avatar} alt="Profile" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-16 h-16 text-gray-400" />
                                                )}
                                            </div>
                                            <Button variant="outline" type="button" className="relative">
                                                Change Photo
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            const reader = new FileReader();
                                                            reader.onloadend = () => {
                                                                setProfile({
                                                                    ...profile,
                                                                    avatar: reader.result as string
                                                                });
                                                            };
                                                            reader.readAsDataURL(file);
                                                        }
                                                    }}
                                                />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t">
                                        <h3 className="font-medium mb-4">Communication Preferences</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id="email-pref"
                                                    checked={profile.communicationPrefs.email}
                                                    onChange={(e) => setProfile({
                                                        ...profile,
                                                        communicationPrefs: {
                                                            ...profile.communicationPrefs,
                                                            email: e.target.checked
                                                        }
                                                    })}
                                                />
                                                <Label htmlFor="email-pref">Email Notifications</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id="sms-pref"
                                                    checked={profile.communicationPrefs.sms}
                                                    onChange={(e) => setProfile({
                                                        ...profile,
                                                        communicationPrefs: {
                                                            ...profile.communicationPrefs,
                                                            sms: e.target.checked
                                                        }
                                                    })}
                                                />
                                                <Label htmlFor="sms-pref">SMS Notifications</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    id="push-pref"
                                                    checked={profile.communicationPrefs.push}
                                                    onChange={(e) => setProfile({
                                                        ...profile,
                                                        communicationPrefs: {
                                                            ...profile.communicationPrefs,
                                                            push: e.target.checked
                                                        }
                                                    })}
                                                />
                                                <Label htmlFor="push-pref">Push Notifications</Label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-6 border-t">
                                        <Button type="submit" disabled={isLoading}>
                                            {isLoading ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="addresses">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle>Address Book</CardTitle>
                                        <CardDescription>
                                            Manage your shipping and billing addresses in Ghana.
                                        </CardDescription>
                                    </div>
                                    <Button>Add New Address</Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {addresses.map(address => (
                                        <Card key={address.id} className={address.isDefault ? 'border-primary' : ''}>
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-medium">
                                                                {address.type === 'shipping' ? '🛒 Shipping Address' : '💳 Billing Address'}
                                                            </h4>
                                                            {address.isDefault && (
                                                                <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                                                                    Default
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                                                            {address.company && <p><span className="font-medium">Company:</span> {address.company}</p>}
                                                            <p>{address.street}</p>
                                                            <p>{address.city}, {address.region} Region</p>
                                                            {address.landmark && <p><span className="font-medium">Landmark:</span> {address.landmark}</p>}
                                                            {address.gps && <p><span className="font-medium">GPS Address:</span> {address.gps}</p>}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button variant="ghost" size="sm" className="h-8">Edit</Button>
                                                        {!address.isDefault && (
                                                            <Button variant="ghost" size="sm" className="h-8 text-destructive">
                                                                Remove
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                {/* Add New Address Form (Collapsible) */}
                                <div className="mt-8">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-lg">Add New Address</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <form className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="address-type">Address Type</Label>
                                                        <select id="address-type" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                                            <option value="shipping">Shipping Address</option>
                                                            <option value="billing">Billing Address</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="company">Company (Optional)</Label>
                                                        <Input id="company" placeholder="Company name" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="street">Street Address*</Label>
                                                        <Input id="street" placeholder="e.g., 123 Osu Oxford Street" required />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="city">City*</Label>
                                                        <Input id="city" placeholder="e.g., Accra" required />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="region">Region*</Label>
                                                        <select id="region" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required>
                                                            <option value="">Select Region</option>
                                                            <option value="Greater Accra">Greater Accra</option>
                                                            <option value="Ashanti">Ashanti</option>
                                                            <option value="Western">Western</option>
                                                            <option value="Central">Central</option>
                                                            <option value="Eastern">Eastern</option>
                                                            <option value="Volta">Volta</option>
                                                            <option value="Northern">Northern</option>
                                                            <option value="Upper East">Upper East</option>
                                                            <option value="Upper West">Upper West</option>
                                                            <option value="Bono">Bono</option>
                                                            <option value="Bono East">Bono East</option>
                                                            <option value="Ahafo">Ahafo</option>
                                                            <option value="Savannah">Savannah</option>
                                                            <option value="North East">North East</option>
                                                            <option value="Oti">Oti</option>
                                                            <option value="Western North">Western North</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="landmark">Landmark (Optional)</Label>
                                                        <Input id="landmark" placeholder="e.g., Near Accra Mall" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="gps">GPS Address (Optional)</Label>
                                                        <Input id="gps" placeholder="e.g., GA-123-4567" />
                                                    </div>
                                                    <div className="flex items-center space-x-2 pt-2">
                                                        <input type="checkbox" id="default-address" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
                                                        <label htmlFor="default-address" className="text-sm font-medium leading-none">
                                                            Set as default address
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="flex justify-end gap-2 pt-4">
                                                    <Button type="button" variant="outline">Cancel</Button>
                                                    <Button type="submit">Save Address</Button>
                                                </div>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="payments">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle>Payment Methods</CardTitle>
                                        <CardDescription>
                                            Manage your saved payment methods.
                                        </CardDescription>
                                    </div>
                                    <Button>Add Payment Method</Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {paymentMethods.map(payment => (
                                        <Card key={payment.id} className={payment.isDefault ? 'border-primary' : ''}>
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center">
                                                        <CreditCard className="w-5 h-5 mr-3 text-muted-foreground" />
                                                        <div>
                                                            <p className="font-medium">•••• •••• •••• {payment.last4}</p>
                                                            <p className="text-sm text-muted-foreground">Expires {payment.exp}</p>
                                                            {payment.isDefault && (
                                                                <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                                                                    Default
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="sm">Edit</Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="orders">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order History</CardTitle>
                                <CardDescription>
                                    View and track your recent orders.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-12">
                                    <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                    <h3 className="text-lg font-medium">No orders yet</h3>
                                    <p className="text-muted-foreground mt-2">
                                        Your order history will appear here once you make a purchase.
                                    </p>
                                    <Button className="mt-4" onClick={() => navigate('/shop')}>
                                        Continue Shopping
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="wishlist">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <CardTitle>Your Wishlist</CardTitle>
                                        <CardDescription>
                                            You have 0 items in your wishlist
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <WishlistItems />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="settings">
                        <Card>
                            <CardHeader>
                                <CardTitle>Account Settings</CardTitle>
                                <CardDescription>
                                    Manage your account security and preferences.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <Lock className="w-5 h-5 mr-3 text-muted-foreground" />
                                        <div className="flex-1">
                                            <h3 className="font-medium">Change Password</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Update your password regularly to keep your account secure.
                                            </p>
                                        </div>
                                        <ChangePasswordModal>
                                          <Button variant="outline">Change</Button>
                                        </ChangePasswordModal>
                                    </div>

                                    <div className="flex items-center pt-4 border-t">
                                        <Bell className="w-5 h-5 mr-3 text-muted-foreground" />
                                        <div className="flex-1">
                                            <h3 className="font-medium">Notification Preferences</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Manage how you receive notifications from us.
                                            </p>
                                        </div>
                                        <NotificationPreferencesModal>
                                            <Button variant="outline">Manage</Button>
                                        </NotificationPreferencesModal>
                                    </div>

                                    <div className="flex items-center pt-4 border-t">
                                        <Settings className="w-5 h-5 mr-3 text-muted-foreground" />
                                        <div className="flex-1">
                                            <h3 className="font-medium">Two-Factor Authentication</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Add an extra layer of security to your account.
                                            </p>
                                        </div>
                                        <Button variant="outline">Enable</Button>
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <h3 className="font-medium text-destructive">Danger Zone</h3>
                                    <p className="text-sm text-muted-foreground mt-1 mb-4">
                                        These actions are irreversible. Proceed with caution.
                                    </p>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 border rounded-md">
                                            <div>
                                                <h4 className="font-medium">Delete Account</h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Permanently delete your account and all associated data.
                                                </p>
                                            </div>
                                            <Button variant="destructive">Delete Account</Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Dashboard;