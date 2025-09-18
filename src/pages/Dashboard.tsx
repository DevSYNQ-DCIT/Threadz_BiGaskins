import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  User, Package, Heart, Settings, LogOut, ArrowLeft,
  CreditCard, MapPin, Bell, Lock, Calendar, Phone,
  Edit, Trash2, Plus, X, Check, Clock, ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import WishlistItems from '@/components/wishlist/WishlistItems';
import { ChangePasswordModal } from '@/components/ChangePasswordModal';
import { NotificationPreferencesModal } from '@/components/NotificationPreferencesModal';

// Form Schemas
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[0-9+\-\s()]*$/, 'Invalid phone number'),
  dob: z.string().optional(),
});

const addressSchema = z.object({
  type: z.enum(['shipping', 'billing']),
  company: z.string().optional(),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  region: z.string().min(2, 'Region is required'),
  landmark: z.string().optional(),
  gps: z.string().optional(),
  isDefault: z.boolean().default(false)
});

const paymentSchema = z.object({
  cardNumber: z.string().min(16, 'Card number must be 16 digits'),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Invalid expiry date (MM/YY)'),
  cvv: z.string().min(3, 'CVV must be at least 3 digits'),
  nameOnCard: z.string().min(2, 'Name on card is required'),
  isDefault: z.boolean().default(false)
});

type ProfileFormData = z.infer<typeof profileSchema>;
type AddressFormData = z.infer<typeof addressSchema>;
type PaymentFormData = z.infer<typeof paymentSchema>;

const Dashboard = () => {
  const { user, logout, updateProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<number | null>(null);
  const [editingPaymentId, setEditingPaymentId] = useState<number | null>(null);

  // Sample data - in a real app, this would come from your backend
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
    }
  ]);

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'card',
      last4: '4242',
      exp: '12/25',
      name: 'Visa',
      isDefault: true
    }
  ]);

  const [orders, setOrders] = useState([
    {
      id: 'ORD-12345',
      date: '2023-06-15',
      status: 'delivered',
      total: 249.99,
      items: [
        { id: '1', name: 'African Print Dress', quantity: 1, price: 129.99 },
        { id: '2', name: 'Leather Sandals', quantity: 1, price: 120.00 }
      ]
    }
  ]);

  // Profile Form
  const { register: registerProfile, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors }, reset: resetProfile } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dob: user?.dob || ''
    }
  });

  // Address Form
  const { register: registerAddress, handleSubmit: handleAddressSubmit, reset: resetAddress, setValue: setAddressValue, formState: { errors: addressErrors } } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      type: 'shipping',
      isDefault: false
    }
  });

  // Payment Form
  const { register: registerPayment, handleSubmit: handlePaymentSubmit, reset: resetPayment, setValue: setPaymentValue, formState: { errors: paymentErrors } } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      isDefault: false
    }
  });

  // Initialize forms with user data
  useEffect(() => {
    if (user) {
      resetProfile({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dob: user.dob || ''
      });
    }
  }, [user, resetProfile]);

  // Handle logout
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
  }, [logout, navigate, toast]);

  // Handle profile update
  const onProfileUpdate = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      await updateProfile(data);
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

  // Address operations
  const onAddressSubmit = (data: AddressFormData) => {
    if (editingAddressId) {
      // Update existing address
      setAddresses(addresses.map(addr => 
        addr.id === editingAddressId ? { ...data, id: editingAddressId } as any : addr
      ));
      toast({
        title: 'Success!',
        description: 'Address updated successfully.',
      });
    } else {
      // Add new address
      const newAddress = { ...data, id: Date.now() };
      setAddresses([...addresses, newAddress as any]);
      toast({
        title: 'Success!',
        description: 'Address added successfully.',
      });
    }
    resetAddress();
    setEditingAddressId(null);
    setIsAddingAddress(false);
  };

  const handleEditAddress = (address: any) => {
    setEditingAddressId(address.id);
    Object.entries(address).forEach(([key, value]) => {
      setAddressValue(key as any, value);
    });
    setIsAddingAddress(true);
  };

  const handleDeleteAddress = (id: number) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setAddresses(addresses.filter(addr => addr.id !== id));
      toast({
        title: 'Success!',
        description: 'Address removed successfully.',
      });
    }
  };

  const setDefaultAddress = (id: number) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  // Payment operations
  const onPaymentSubmit = (data: PaymentFormData) => {
    if (editingPaymentId) {
      // Update existing payment method
      setPaymentMethods(paymentMethods.map(pm => 
        pm.id === editingPaymentId ? { 
          ...pm, 
          last4: data.cardNumber.slice(-4),
          exp: data.expiry,
          name: data.nameOnCard,
          isDefault: data.isDefault 
        } : pm
      ));
      toast({
        title: 'Success!',
        description: 'Payment method updated successfully.',
      });
    } else {
      // Add new payment method
      const newPayment = { 
        id: Date.now(),
        type: 'card',
        last4: data.cardNumber.slice(-4),
        exp: data.expiry,
        name: data.nameOnCard,
        isDefault: data.isDefault 
      };
      
      // If setting as default, update others
      if (data.isDefault) {
        setPaymentMethods(paymentMethods.map(pm => ({
          ...pm,
          isDefault: false
        })));
      }
      
      setPaymentMethods([...paymentMethods, newPayment]);
      toast({
        title: 'Success!',
        description: 'Payment method added successfully.',
      });
    }
    resetPayment();
    setEditingPaymentId(null);
    setIsAddingPayment(false);
  };

  const handleEditPayment = (payment: any) => {
    setEditingPaymentId(payment.id);
    setPaymentValue('nameOnCard', payment.name);
    setPaymentValue('expiry', payment.exp);
    setPaymentValue('isDefault', payment.isDefault);
    setIsAddingPayment(true);
  };

  const handleDeletePayment = (id: number) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
      toast({
        title: 'Success!',
        description: 'Payment method removed successfully.',
      });
    }
  };

  const setDefaultPayment = (id: number) => {
    setPaymentMethods(paymentMethods.map(pm => ({
      ...pm,
      isDefault: pm.id === id
    })));
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // In a real app, you would call an API to delete the account
        // await deleteAccount();
        await logout();
        navigate('/');
        toast({
          title: 'Account Deleted',
          description: 'Your account has been successfully deleted.',
        });
      } catch (error) {
        console.error('Error deleting account:', error);
        toast({
          title: 'Error',
          description: 'Failed to delete account. Please try again.',
          variant: 'destructive',
        });
      }
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <img 
              src={user.photoURL || "/src/assets/favicon.ico"} 
              alt="Profile" 
              className="w-10 h-10 object-contain rounded-full"
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

        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-8">
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="addresses">
              <MapPin className="w-4 h-4 mr-2" />
              Addresses
            </TabsTrigger>
            <TabsTrigger value="payments">
              <CreditCard className="w-4 h-4 mr-2" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="orders">
              <Package className="w-4 h-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="wishlist">
              <Heart className="w-4 h-4 mr-2" />
              Wishlist
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your personal information and manage how we communicate with you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileSubmit(onProfileUpdate)} className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          {...registerProfile('name')}
                          error={profileErrors.name?.message}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          {...registerProfile('email')}
                          disabled
                          error={profileErrors.email?.message}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">
                          <Phone className="inline w-4 h-4 mr-2" />
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          {...registerProfile('phone')}
                          error={profileErrors.phone?.message}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dob">
                          <Calendar className="inline w-4 h-4 mr-2" />
                          Date of Birth
                        </Label>
                        <Input
                          id="dob"
                          type="date"
                          {...registerProfile('dob')}
                          error={profileErrors.dob?.message}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
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
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // In a real app, you would upload the image to a storage service
                              // and update the user's profile with the new photo URL
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                // Update profile with new photo URL
                                console.log('New profile photo:', reader.result);
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
                          defaultChecked
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="email-pref">Email Notifications</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="sms-pref"
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <Label htmlFor="sms-pref">SMS Notifications</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="push-pref"
                          defaultChecked
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
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

          {/* Addresses Tab */}
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
                  <Button 
                    onClick={() => {
                      resetAddress();
                      setEditingAddressId(null);
                      setIsAddingAddress(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Address
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isAddingAddress && (
                  <Card className="mb-6">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">
                          {editingAddressId ? 'Edit Address' : 'Add New Address'}
                        </CardTitle>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            setIsAddingAddress(false);
                            setEditingAddressId(null);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleAddressSubmit(onAddressSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="address-type">Address Type</Label>
                            <select 
                              id="address-type" 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...registerAddress('type')}
                            >
                              <option value="shipping">Shipping Address</option>
                              <option value="billing">Billing Address</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="company">Company (Optional)</Label>
                            <Input 
                              id="company" 
                              placeholder="Company name" 
                              {...registerAddress('company')}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="street">Street Address*</Label>
                            <Input 
                              id="street" 
                              placeholder="e.g., 123 Osu Oxford Street" 
                              {...registerAddress('street')}
                              error={addressErrors.street?.message}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="city">City*</Label>
                            <Input 
                              id="city" 
                              placeholder="e.g., Accra" 
                              {...registerAddress('city')}
                              error={addressErrors.city?.message}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="region">Region*</Label>
                            <select 
                              id="region" 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                              {...registerAddress('region')}
                            >
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
                            {addressErrors.region && (
                              <p className="text-sm text-destructive">{addressErrors.region.message}</p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="landmark">Landmark (Optional)</Label>
                            <Input 
                              id="landmark" 
                              placeholder="e.g., Near Accra Mall" 
                              {...registerAddress('landmark')}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="gps">GPS Address (Optional)</Label>
                            <Input 
                              id="gps" 
                              placeholder="e.g., GA-123-4567" 
                              {...registerAddress('gps')}
                            />
                          </div>
                          <div className="flex items-center space-x-2 pt-2">
                            <input 
                              type="checkbox" 
                              id="default-address" 
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" 
                              {...registerAddress('isDefault')}
                            />
                            <label htmlFor="default-address" className="text-sm font-medium leading-none">
                              Set as default address
                            </label>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => {
                              setIsAddingAddress(false);
                              setEditingAddressId(null);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">
                            {editingAddressId ? 'Update Address' : 'Add Address'}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  {addresses.length === 0 ? (
                    <div className="col-span-2 text-center py-12">
                      <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No saved addresses</h3>
                      <p className="text-muted-foreground mt-2">
                        You haven't added any addresses yet.
                      </p>
                      <Button 
                        className="mt-4" 
                        onClick={() => setIsAddingAddress(true)}
                      >
                        Add Your First Address
                      </Button>
                    </div>
                  ) : (
                    addresses.map(address => (
                      <Card key={address.id} className={address.isDefault ? 'border-primary' : ''}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
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
                            <div className="flex flex-col gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => handleEditAddress(address)}
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </Button>
                              {!address.isDefault && (
                                <>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                    onClick={() => handleDeleteAddress(address.id)}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                                    onClick={() => setDefaultAddress(address.id)}
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
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
                  <Button 
                    onClick={() => {
                      resetPayment();
                      setEditingPaymentId(null);
                      setIsAddingPayment(true);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isAddingPayment && (
                  <Card className="mb-6">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">
                          {editingPaymentId ? 'Edit Payment Method' : 'Add Payment Method'}
                        </CardTitle>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            setIsAddingPayment(false);
                            setEditingPaymentId(null);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handlePaymentSubmit(onPaymentSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="card-number">Card Number</Label>
                            <Input 
                              id="card-number" 
                              placeholder="0000 0000 0000 0000" 
                              {...registerPayment('cardNumber')}
                              error={paymentErrors.cardNumber?.message}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="name-on-card">Name on Card</Label>
                            <Input 
                              id="name-on-card" 
                              placeholder="John Doe" 
                              {...registerPayment('nameOnCard')}
                              error={paymentErrors.nameOnCard?.message}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input 
                              id="expiry" 
                              placeholder="MM/YY" 
                              {...registerPayment('expiry')}
                              error={paymentErrors.expiry?.message}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input 
                              id="cvv" 
                              type="password" 
                              placeholder="123" 
                              {...registerPayment('cvv')}
                              error={paymentErrors.cvv?.message}
                            />
                          </div>
                          <div className="flex items-center space-x-2 pt-2">
                            <input 
                              type="checkbox" 
                              id="default-payment" 
                              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" 
                              {...registerPayment('isDefault')}
                            />
                            <label htmlFor="default-payment" className="text-sm font-medium leading-none">
                              Set as default payment method
                            </label>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => {
                              setIsAddingPayment(false);
                              setEditingPaymentId(null);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button type="submit">
                            {editingPaymentId ? 'Update Payment Method' : 'Add Payment Method'}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-4">
                  {paymentMethods.length === 0 ? (
                    <div className="text-center py-12">
                      <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No payment methods</h3>
                      <p className="text-muted-foreground mt-2">
                        You haven't added any payment methods yet.
                      </p>
                      <Button 
                        className="mt-4" 
                        onClick={() => setIsAddingPayment(true)}
                      >
                        Add Payment Method
                      </Button>
                    </div>
                  ) : (
                    paymentMethods.map(payment => (
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
                            <div className="flex gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => handleEditPayment(payment)}
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </Button>
                              {!payment.isDefault && (
                                <>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                    onClick={() => handleDeletePayment(payment.id)}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                                    onClick={() => setDefaultPayment(payment.id)}
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>
                  View and track your recent orders.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
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
                ) : (
                  <div className="space-y-6">
                    {orders.map(order => (
                      <Card key={order.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">Order #{order.id}</h3>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  order.status === 'delivered' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                Placed on {new Date(order.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">${order.total.toFixed(2)}</p>
                              <p className="text-sm text-muted-foreground">
                                {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t">
                            <h4 className="text-sm font-medium mb-2">Items</h4>
                            <div className="space-y-2">
                              {order.items.map(item => (
                                <div key={item.id} className="flex justify-between items-center">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                                      <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">{item.name}</p>
                                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                  </div>
                                  <p className="text-sm">${item.price.toFixed(2)}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t flex justify-end">
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Subtotal</span>
                                <span className="text-sm">${order.total.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Shipping</span>
                                <span className="text-sm">$0.00</span>
                              </div>
                              <div className="flex justify-between font-medium">
                                <span>Total</span>
                                <span>${order.total.toFixed(2)}</span>
                              </div>
                              <div className="pt-2 flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => navigate(`/orders/${order.id}`)}>
                                  View Details
                                </Button>
                                <Button size="sm" onClick={() => {
                                  // In a real app, you would implement reorder functionality
                                  toast({
                                    title: 'Reorder',
                                    description: 'Adding items to cart...',
                                  });
                                }}>
                                  Reorder
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Your Wishlist</CardTitle>
                    <CardDescription>
                      Your saved items will appear here.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <WishlistItems />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
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
                      <Button 
                        variant="destructive"
                        onClick={handleDeleteAccount}
                      >
                        Delete Account
                      </Button>
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