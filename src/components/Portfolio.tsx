import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useToast } from '@/hooks/use-toast';
import { Heart } from 'lucide-react';

// Import the images from assets
import img1 from '@/assets/087d3fd9-dc65-4334-a6ae-a9fb1b9dc237.jpg';
import img2 from '@/assets/Asoebi , Owambe style.jpg';
import img3 from '@/assets/c9811def-bcab-.jpg';
import img4 from '@/assets/DescriptionTop Category.jpg';
import img5 from '@/assets/fa5ff4b4-580b.jpg';
import img6 from '@/assets/fa28db1-3050 (2).jpg';
import img7 from '@/assets/fa28db1-3050 (4).jpg';
import img8 from '@/assets/fa28db1-3050 (7).jpg';
import img9 from '@/assets/woman-.jpg';
import img10 from '@/assets/gene.jpg';

// Import casual images
import casual1 from '@/assets/casual (1).jpg';
import casual2 from '@/assets/casual (2).jpg';
import casual3 from '@/assets/casual (3).jpg';
import casual4 from '@/assets/casual (4).jpg';
import casual5 from '@/assets/casual (5).jpg';
import casual6 from '@/assets/casual (6).jpg';
import casual7 from '@/assets/casual (7).jpg';
import casual8 from '@/assets/casual (8).jpg';
import casual9 from '@/assets/casual (9).jpg';
import casual10 from '@/assets/casual (10).jpg';
import casual11 from '@/assets/casual (11).jpg';
import casual12 from '@/assets/casual (12).jpg';
import casual13 from '@/assets/casual (13).jpg';
import casual14 from '@/assets/casual (14).jpg';

// Import contemporary images
import contemporary1 from '@/assets/Contemporary  (1).jpg';
import contemporary2 from '@/assets/Contemporary  (2).jpg';
import contemporary3 from '@/assets/Contemporary  (3).jpg';
import contemporary4 from '@/assets/Contemporary  (4).jpg';
import contemporary5 from '@/assets/Contemporary  (5).jpg';
import contemporary6 from '@/assets/Contemporary  (6).jpg';
import contemporary7 from '@/assets/Contemporary  (7).jpg';
import contemporary8 from '@/assets/Contemporary  (8).jpg';
import contemporary9 from '@/assets/Contemporary  (9).jpg';
import contemporary10 from '@/assets/Contemporary  (10).jpg';
import contemporary11 from '@/assets/Contemporary  (11).jpg';
import contemporary12 from '@/assets/Contemporary  (12).jpg';
import contemporary13 from '@/assets/Contemporary  (13).jpg';
import contemporary14 from '@/assets/Contemporary  (14).jpg';
import contemporary15 from '@/assets/Contemporary  (15).jpg';
import contemporary16 from '@/assets/Contemporary  (16).jpg';
import contemporary17 from '@/assets/Contemporary  (17).jpg';

// Import formal images
import formal1 from '@/assets/Formal  (1).jpg';
import formal2 from '@/assets/Formal  (2).jpg';
import formal3 from '@/assets/Formal  (3).jpg';
import formal4 from '@/assets/Formal  (4).jpg';
import formal5 from '@/assets/Formal  (5).jpg';
import formal6 from '@/assets/Formal  (6).jpg';
import formal7 from '@/assets/Formal  (7).jpg';
import formal8 from '@/assets/Formal  (8).jpg';
import formal9 from '@/assets/Formal  (9).jpg';
import formal10 from '@/assets/Formal  (10).jpg';

// Import luxury images
import luxury1 from '@/assets/Luxury (1).jpg';
import luxury2 from '@/assets/Luxury (2).jpg';
import luxury3 from '@/assets/Luxury (3).jpg';
import luxury4 from '@/assets/Luxury (4).jpg';
import luxury5 from '@/assets/Luxury (5).jpg';
import luxury6 from '@/assets/Luxury (6).jpg';
import luxury7 from '@/assets/Luxury (7).jpg';
import luxury8 from '@/assets/Luxury (8).jpg';
import luxury9 from '@/assets/Luxury (9).jpg';
import luxury10 from '@/assets/Luxury (10).jpg';
import luxury11 from '@/assets/Luxury (11).jpg';
import luxury12 from '@/assets/Luxury (12).jpg';
import luxury13 from '@/assets/Luxury (13).jpg';
import luxury14 from '@/assets/Luxury (14).jpg';
import luxury15 from '@/assets/Luxury (15).jpg';

// Import party images
import party1 from '@/assets/Party  (1).jpg';
import party2 from '@/assets/Party  (2).jpg';
import party3 from '@/assets/Party  (3).jpg';
import party4 from '@/assets/Party  (4).jpg';
import party5 from '@/assets/Party  (5).jpg';
import party6 from '@/assets/Party  (6).jpg';
import party7 from '@/assets/Party  (7).jpg';
import party8 from '@/assets/Party  (8).jpg';
import party9 from '@/assets/Party  (9).jpg';
import party10 from '@/assets/Party  (10).jpg';
import party11 from '@/assets/Party  (11).jpg';
import party12 from '@/assets/Party  (12).jpg';
import party13 from '@/assets/Party  (13).jpg';
import party14 from '@/assets/Party  (14).jpg';
import party15 from '@/assets/Party  (15).jpg';

// Import professional images
import professional1 from '@/assets/Professional  (1).jpg';
import professional2 from '@/assets/Professional  (2).jpg';
import professional3 from '@/assets/Professional  (3).jpg';
import professional4 from '@/assets/Professional  (4).jpg';
import professional5 from '@/assets/Professional  (5).jpg';
import professional6 from '@/assets/Professional  (6).jpg';
import professional7 from '@/assets/Professional  (7).jpg';
import professional8 from '@/assets/Professional  (8).jpg';
import professional9 from '@/assets/Professional  (9).jpg';
import professional10 from '@/assets/Professional  (10).jpg';
import professional11 from '@/assets/Professional  (11).jpg';
import professional12 from '@/assets/Professional  (12).jpg';
import professional13 from '@/assets/Professional  (13).jpg';
import professional14 from '@/assets/Professional  (14).jpg';
import professional15 from '@/assets/Professional  (15).jpg';

// Import traditional images
import traditional1 from '@/assets/Traditional  (1).jpg';
import traditional2 from '@/assets/Traditional  (2).jpg';
import traditional3 from '@/assets/Traditional  (3).jpg';
import traditional4 from '@/assets/Traditional  (4).jpg';
import traditional5 from '@/assets/Traditional  (5).jpg';
import traditional6 from '@/assets/Traditional  (6).jpg';
import traditional7 from '@/assets/Traditional  (7).jpg';
import traditional8 from '@/assets/Traditional  (8).jpg';
import traditional9 from '@/assets/Traditional  (9).jpg';
import traditional10 from '@/assets/Traditional  (10).jpg';
import traditional11 from '@/assets/Traditional  (11).jpg';
import traditional12 from '@/assets/Traditional  (12).jpg';
import traditional13 from '@/assets/Traditional  (13).jpg';
import traditional14 from '@/assets/Traditional  (14).jpg';
import traditional15 from '@/assets/Traditional  (15).jpg';

const Portfolio = () => {
    const { addItem } = useCart();
    const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
    const { toast } = useToast();
    const [activeCategory, setActiveCategory] = useState('All');

    const handleAddToCart = (item: any) => {
        addItem({
            id: item.id.toString(),
            name: item.title,
            price: item.price,
            image: item.image,
        });
        toast({
            title: "Added to Cart",
            description: `${item.title} has been added to your cart.`,
        });
    };

    const handleWishlistToggle = (item: any) => {
        const wishlistItem = {
            id: item.id.toString(),
            name: item.title,
            price: item.price,
            image: item.image,
            category: item.category
        };

        if (isInWishlist(item.id)) {
            removeFromWishlist(item.id);
        } else {
            addToWishlist(wishlistItem);
        }
    };

    const portfolioItems = [
        {
            id: 2,
            title: "Asoebi Collection",
            category: "Traditional",
            image: img2,
            description: "Beautiful Asoebi styles perfect for weddings and special occasions.",
            tags: ["Traditional", "Owambe", "Vibrant"],
            price: 1299.99,
        },
        {
            id: 3,
            title: "Chic Office Attire",
            category: "Professional",
            image: img3,
            description: "Sophisticated office wear that combines comfort and style.",
            tags: ["Workwear", "Elegant", "Professional"],
            price: 899.99,
        },
        {
            id: 4,
            title: "Luxury Collection",
            category: "Luxury",
            image: img4,
            description: "High-end fashion pieces for the modern, sophisticated woman.",
            tags: ["Luxury", "Premium", "Elegant"],
            price: 2499.99,
        },
        {
            id: 5,
            title: "Casual Elegance",
            category: "Casual",
            image: img5,
            description: "Effortlessly stylish casual wear for everyday comfort.",
            tags: ["Casual", "Comfort", "Chic"],
            price: 599.99,
        },
        {
            id: 7,
            title: "Formal Attire",
            category: "Formal",
            image: img7,
            description: "Classic formal wear for important events and occasions.",
            tags: ["Formal", "Classic", "Elegant"],
            price: 1599.99,
        },
        {
            id: 9,
            title: "Modern Woman",
            category: "Contemporary",
            image: img9,
            description: "Contemporary styles for the modern, confident woman.",
            tags: ["Modern", "Trendy", "Chic"],
            price: 999.99,
        },
        {
            id: 10,
            title: "Gene",
            category: "Casual",
            image: img10,
            description: "Casual wear for everyday comfort.",
            tags: ["Casual", "Comfort", "Chic"],
            price: 599.99,
        },
        {
            id: 12,
            title: "Professional Collection",
            category: "Professional",
            image: professional1,
            description: "Elegant and sophisticated workwear for the modern professional.",
            tags: ["Professional", "Office", "Business"],
            price: 1299.99,
        },
        {
            id: 13,
            title: "Traditional Collection",
            category: "Traditional",
            image: traditional1,
            description: "Authentic traditional wear celebrating cultural heritage.",
            tags: ["Traditional", "Cultural", "Heritage"],
            price: 1599.99,
        },
    ];

    const casualItems = [
        { id: 'casual-1', title: 'Casual Outfit 1', image: casual1, category: 'Casual', description: 'Comfortable and stylish casual wear', tags: ['Casual', 'Comfortable'], price: 499.99 },
        { id: 'casual-2', title: 'Casual Outfit 2', image: casual2, category: 'Casual', description: 'Trendy casual look', tags: ['Casual', 'Trendy'], price: 549.99 },
        { id: 'casual-3', title: 'Casual Outfit 3', image: casual3, category: 'Casual', description: 'Relaxed everyday style', tags: ['Casual', 'Relaxed'], price: 599.99 },
        { id: 'casual-4', title: 'Casual Outfit 4', image: casual4, category: 'Casual', description: 'Chic casual fashion', tags: ['Casual', 'Chic'], price: 529.99 },
        { id: 'casual-5', title: 'Casual Outfit 5', image: casual5, category: 'Casual', description: 'Effortlessly stylish', tags: ['Casual', 'Stylish'], price: 579.99 },
        { id: 'casual-6', title: 'Casual Outfit 6', image: casual6, category: 'Casual', description: 'Comfort meets style', tags: ['Casual', 'Comfortable'], price: 549.99 },
        { id: 'casual-7', title: 'Casual Outfit 7', image: casual7, category: 'Casual', description: 'Everyday casual look', tags: ['Casual', 'Everyday'], price: 499.99 },
        { id: 'casual-8', title: 'Casual Outfit 8', image: casual8, category: 'Casual', description: 'Modern casual style', tags: ['Casual', 'Modern'], price: 549.99 },
        { id: 'casual-9', title: 'Casual Outfit 9', image: casual9, category: 'Casual', description: 'Relaxed weekend look', tags: ['Casual', 'Relaxed'], price: 529.99 },
        { id: 'casual-10', title: 'Casual Outfit 10', image: casual10, category: 'Casual', description: 'Chic and comfortable', tags: ['Casual', 'Chic'], price: 599.99 },
        { id: 'casual-11', title: 'Casual Outfit 11', image: casual11, category: 'Casual', description: 'Stylish casual wear', tags: ['Casual', 'Stylish'], price: 549.99 },
        { id: 'casual-12', title: 'Casual Outfit 12', image: casual12, category: 'Casual', description: 'Comfortable daily wear', tags: ['Casual', 'Comfortable'], price: 499.99 },
        { id: 'casual-13', title: 'Casual Outfit 13', image: casual13, category: 'Casual', description: 'Trendy casual look', tags: ['Casual', 'Trendy'], price: 579.99 },
        { id: 'casual-14', title: 'Casual Outfit 14', image: casual14, category: 'Casual', description: 'Elegant casual style', tags: ['Casual', 'Elegant'], price: 599.99 },
    ];

    const contemporaryItems = [
        { id: 'contemporary-1', title: 'Contemporary Outfit 1', image: contemporary1, category: 'Contemporary', description: 'Modern and stylish contemporary wear', tags: ['Contemporary', 'Modern'], price: 599.99 },
        { id: 'contemporary-2', title: 'Contemporary Outfit 2', image: contemporary2, category: 'Contemporary', description: 'Chic contemporary fashion', tags: ['Contemporary', 'Chic'], price: 649.99 },
        { id: 'contemporary-3', title: 'Contemporary Outfit 3', image: contemporary3, category: 'Contemporary', description: 'Trendy contemporary look', tags: ['Contemporary', 'Trendy'], price: 699.99 },
        { id: 'contemporary-4', title: 'Contemporary Outfit 4', image: contemporary4, category: 'Contemporary', description: 'Elegant contemporary style', tags: ['Contemporary', 'Elegant'], price: 729.99 },
        { id: 'contemporary-5', title: 'Contemporary Outfit 5', image: contemporary5, category: 'Contemporary', description: 'Sophisticated contemporary wear', tags: ['Contemporary', 'Sophisticated'], price: 679.99 },
        { id: 'contemporary-6', title: 'Contemporary Outfit 6', image: contemporary6, category: 'Contemporary', description: 'Modern chic look', tags: ['Contemporary', 'Chic', 'Modern'], price: 749.99 },
        { id: 'contemporary-7', title: 'Contemporary Outfit 7', image: contemporary7, category: 'Contemporary', description: 'Stylish contemporary ensemble', tags: ['Contemporary', 'Stylish'], price: 699.99 },
        { id: 'contemporary-8', title: 'Contemporary Outfit 8', image: contemporary8, category: 'Contemporary', description: 'Fashion-forward contemporary look', tags: ['Contemporary', 'Fashion-Forward'], price: 779.99 },
        { id: 'contemporary-9', title: 'Contemporary Outfit 9', image: contemporary9, category: 'Contemporary', description: 'Trend-setting contemporary style', tags: ['Contemporary', 'Trendy'], price: 759.99 },
        { id: 'contemporary-10', title: 'Contemporary Outfit 10', image: contemporary10, category: 'Contemporary', description: 'Chic and modern look', tags: ['Contemporary', 'Chic', 'Modern'], price: 699.99 },
        { id: 'contemporary-11', title: 'Contemporary Outfit 11', image: contemporary11, category: 'Contemporary', description: 'Elegant contemporary fashion', tags: ['Contemporary', 'Elegant'], price: 729.99 },
        { id: 'contemporary-12', title: 'Contemporary Outfit 12', image: contemporary12, category: 'Contemporary', description: 'Modern sophistication', tags: ['Contemporary', 'Modern', 'Sophisticated'], price: 769.99 },
        { id: 'contemporary-13', title: 'Contemporary Outfit 13', image: contemporary13, category: 'Contemporary', description: 'Chic contemporary style', tags: ['Contemporary', 'Chic'], price: 749.99 },
        { id: 'contemporary-14', title: 'Contemporary Outfit 14', image: contemporary14, category: 'Contemporary', description: 'Trendy modern look', tags: ['Contemporary', 'Trendy', 'Modern'], price: 799.99 },
        { id: 'contemporary-15', title: 'Contemporary Outfit 15', image: contemporary15, category: 'Contemporary', description: 'Elegant and modern', tags: ['Contemporary', 'Elegant', 'Modern'], price: 829.99 },
        { id: 'contemporary-16', title: 'Contemporary Outfit 16', image: contemporary16, category: 'Contemporary', description: 'Chic contemporary design', tags: ['Contemporary', 'Chic'], price: 779.99 },
        { id: 'contemporary-17', title: 'Contemporary Outfit 17', image: contemporary17, category: 'Contemporary', description: 'Modern contemporary fashion', tags: ['Contemporary', 'Modern'], price: 759.99 },
    ];

    const formalItems = [
        { id: 'formal-1', title: 'Formal Suit 1', image: formal1, category: 'Formal', description: 'Elegant formal suit for special occasions', tags: ['Formal', 'Elegant'], price: 1299.99 },
        { id: 'formal-2', title: 'Formal Suit 2', image: formal2, category: 'Formal', description: 'Classic business formal wear', tags: ['Formal', 'Business'], price: 1399.99 },
        { id: 'formal-3', title: 'Formal Suit 3', image: formal3, category: 'Formal', description: 'Premium tailored suit', tags: ['Formal', 'Tailored'], price: 1499.99 },
        { id: 'formal-4', title: 'Formal Suit 4', image: formal4, category: 'Formal', description: 'Executive formal attire', tags: ['Formal', 'Executive'], price: 1599.99 },
        { id: 'formal-5', title: 'Formal Suit 5', image: formal5, category: 'Formal', description: 'Slim fit formal suit', tags: ['Formal', 'Slim Fit'], price: 1399.99 },
        { id: 'formal-6', title: 'Formal Suit 6', image: formal6, category: 'Formal', description: 'Classic black-tie formal', tags: ['Formal', 'Black-Tie'], price: 1699.99 },
        { id: 'formal-7', title: 'Formal Suit 7', image: formal7, category: 'Formal', description: 'Business professional attire', tags: ['Formal', 'Professional'], price: 1499.99 },
        { id: 'formal-8', title: 'Formal Suit 8', image: formal8, category: 'Formal', description: 'Luxury formal suit', tags: ['Formal', 'Luxury'], price: 1799.99 },
        { id: 'formal-9', title: 'Formal Suit 9', image: formal9, category: 'Formal', description: 'Modern formal wear', tags: ['Formal', 'Modern'], price: 1599.99 },
        { id: 'formal-10', title: 'Formal Suit 10', image: formal10, category: 'Formal', description: 'Premium business formal', tags: ['Formal', 'Business'], price: 1699.99 },
    ];

    const luxuryItems = [
        { id: 'luxury-1', title: 'Luxury Gown 1', image: luxury1, category: 'Luxury', description: 'Exclusive designer evening gown', tags: ['Luxury', 'Designer', 'Evening'], price: 2499.99 },
        { id: 'luxury-2', title: 'Luxury Gown 2', image: luxury2, category: 'Luxury', description: 'Handcrafted couture masterpiece', tags: ['Luxury', 'Couture', 'Handmade'], price: 2899.99 },
        { id: 'luxury-3', title: 'Luxury Gown 3', image: luxury3, category: 'Luxury', description: 'Bespoke red carpet dress', tags: ['Luxury', 'Bespoke', 'Red Carpet'], price: 3199.99 },
        { id: 'luxury-4', title: 'Luxury Gown 4', image: luxury4, category: 'Luxury', description: 'Haute couture evening wear', tags: ['Luxury', 'Haute Couture', 'Evening'], price: 3499.99 },
        { id: 'luxury-5', title: 'Luxury Gown 5', image: luxury5, category: 'Luxury', description: 'Limited edition designer piece', tags: ['Luxury', 'Limited Edition', 'Designer'], price: 3699.99 },
        { id: 'luxury-6', title: 'Luxury Gown 6', image: luxury6, category: 'Luxury', description: 'Hand-embroidered silk gown', tags: ['Luxury', 'Hand-Embroidered', 'Silk'], price: 2999.99 },
        { id: 'luxury-7', title: 'Luxury Gown 7', image: luxury7, category: 'Luxury', description: 'Crystal embellished evening dress', tags: ['Luxury', 'Crystal', 'Evening'], price: 3299.99 },
        { id: 'luxury-8', title: 'Luxury Gown 8', image: luxury8, category: 'Luxury', description: 'Custom-made designer gown', tags: ['Luxury', 'Custom', 'Designer'], price: 3599.99 },
        { id: 'luxury-9', title: 'Luxury Gown 9', image: luxury9, category: 'Luxury', description: 'Luxury silk satin dress', tags: ['Luxury', 'Silk', 'Satin'], price: 3099.99 },
        { id: 'luxury-10', title: 'Luxury Gown 10', image: luxury10, category: 'Luxury', description: 'Exclusive runway piece', tags: ['Luxury', 'Runway', 'Exclusive'], price: 3799.99 },
        { id: 'luxury-11', title: 'Luxury Gown 11', image: luxury11, category: 'Luxury', description: 'Hand-beaded evening dress', tags: ['Luxury', 'Hand-Beaded', 'Evening'], price: 3399.99 },
        { id: 'luxury-12', title: 'Luxury Gown 12', image: luxury12, category: 'Luxury', description: 'Designer bridal couture', tags: ['Luxury', 'Bridal', 'Couture'], price: 3999.99 },
        { id: 'luxury-13', title: 'Luxury Gown 13', image: luxury13, category: 'Luxury', description: 'Custom-fitted evening gown', tags: ['Luxury', 'Custom', 'Evening'], price: 3599.99 },
        { id: 'luxury-14', title: 'Luxury Gown 14', image: luxury14, category: 'Luxury', description: 'Luxury lace and tulle dress', tags: ['Luxury', 'Lace', 'Tulle'], price: 3199.99 },
        { id: 'luxury-15', title: 'Luxury Gown 15', image: luxury15, category: 'Luxury', description: 'Exclusive designer collection', tags: ['Luxury', 'Exclusive', 'Designer'], price: 3699.99 },
    ];

    const partyItems = [
        { id: 'party-1', title: 'Party Dress 1', image: party1, category: 'Party', description: 'Sparkling sequin party dress', tags: ['Party', 'Sequin', 'Sparkle'], price: 899.99 },
        { id: 'party-2', title: 'Party Dress 2', image: party2, category: 'Party', description: 'Flirty bodycon party dress', tags: ['Party', 'Bodycon', 'Sexy'], price: 799.99 },
        { id: 'party-3', title: 'Party Dress 3', image: party3, category: 'Party', description: 'Elegant cocktail dress', tags: ['Party', 'Cocktail', 'Elegant'], price: 849.99 },
        { id: 'party-4', title: 'Party Dress 4', image: party4, category: 'Party', description: 'Chic off-shoulder party dress', tags: ['Party', 'Off-Shoulder', 'Chic'], price: 779.99 },
        { id: 'party-5', title: 'Party Dress 5', image: party5, category: 'Party', description: 'Glitter mini party dress', tags: ['Party', 'Glitter', 'Mini'], price: 829.99 },
        { id: 'party-6', title: 'Party Dress 6', image: party6, category: 'Party', description: 'Satin slip party dress', tags: ['Party', 'Satin', 'Slip'], price: 869.99 },
        { id: 'party-7', title: 'Party Dress 7', image: party7, category: 'Party', description: 'Metallic party dress', tags: ['Party', 'Metallic', 'Shimmer'], price: 899.99 },
        { id: 'party-8', title: 'Party Dress 8', image: party8, category: 'Party', description: 'Velvet party dress', tags: ['Party', 'Velvet', 'Luxury'], price: 949.99 },
        { id: 'party-9', title: 'Party Dress 9', image: party9, category: 'Party', description: 'Feather trim party dress', tags: ['Party', 'Feather', 'Glam'], price: 999.99 },
        { id: 'party-10', title: 'Party Dress 10', image: party10, category: 'Party', description: 'Mesh panel party dress', tags: ['Party', 'Mesh', 'Edgy'], price: 879.99 },
        { id: 'party-11', title: 'Party Dress 11', image: party11, category: 'Party', description: 'High-low party dress', tags: ['Party', 'High-Low', 'Trendy'], price: 899.99 },
        { id: 'party-12', title: 'Party Dress 12', image: party12, category: 'Party', description: 'Lace-up back party dress', tags: ['Party', 'Lace-Up', 'Sexy'], price: 929.99 },
        { id: 'party-13', title: 'Party Dress 13', image: party13, category: 'Party', description: 'Cut-out detail party dress', tags: ['Party', 'Cut-Out', 'Modern'], price: 949.99 },
        { id: 'party-14', title: 'Party Dress 14', image: party14, category: 'Party', description: 'Tiered ruffle party dress', tags: ['Party', 'Ruffle', 'Feminine'], price: 969.99 },
        { id: 'party-15', title: 'Party Dress 15', image: party15, category: 'Party', description: 'One-shoulder party dress', tags: ['Party', 'One-Shoulder', 'Elegant'], price: 919.99 },
    ];

    const professionalItems = [
        { id: 'professional-1', title: 'Professional Suit 1', image: professional1, category: 'Professional', description: 'Classic business suit for the office', tags: ['Professional', 'Business', 'Office'], price: 1299.99 },
        { id: 'professional-2', title: 'Professional Suit 2', image: professional2, category: 'Professional', description: 'Tailored blazer and pants set', tags: ['Professional', 'Tailored', 'Chic'], price: 1199.99 },
        { id: 'professional-3', title: 'Professional Suit 3', image: professional3, category: 'Professional', description: 'Executive power suit', tags: ['Professional', 'Executive', 'Power'], price: 1399.99 },
        { id: 'professional-4', title: 'Professional Suit 4', image: professional4, category: 'Professional', description: 'Modern business attire', tags: ['Professional', 'Modern', 'Business'], price: 1249.99 },
        { id: 'professional-5', title: 'Professional Suit 5', image: professional5, category: 'Professional', description: 'Slim fit professional suit', tags: ['Professional', 'Slim Fit', 'Stylish'], price: 1349.99 },
        { id: 'professional-6', title: 'Professional Suit 6', image: professional6, category: 'Professional', description: 'Classic pinstripe suit', tags: ['Professional', 'Pinstripe', 'Classic'], price: 1449.99 },
        { id: 'professional-7', title: 'Professional Suit 7', image: professional7, category: 'Professional', description: 'Double-breasted power suit', tags: ['Professional', 'Double-Breasted', 'Power'], price: 1499.99 },
        { id: 'professional-8', title: 'Professional Suit 8', image: professional8, category: 'Professional', description: 'Modern business casual', tags: ['Professional', 'Business Casual', 'Modern'], price: 1099.99 },
        { id: 'professional-9', title: 'Professional Suit 9', image: professional9, category: 'Professional', description: 'Elegant office attire', tags: ['Professional', 'Elegant', 'Office'], price: 1199.99 },
        { id: 'professional-10', title: 'Professional Suit 10', image: professional10, category: 'Professional', description: 'Chic workwear ensemble', tags: ['Professional', 'Chic', 'Workwear'], price: 1299.99 },
        { id: 'professional-11', title: 'Professional Suit 11', image: professional11, category: 'Professional', description: 'Minimalist work outfit', tags: ['Professional', 'Minimalist', 'Work'], price: 1149.99 },
        { id: 'professional-12', title: 'Professional Suit 12', image: professional12, category: 'Professional', description: 'Corporate power dressing', tags: ['Professional', 'Corporate', 'Power'], price: 1399.99 },
        { id: 'professional-13', title: 'Professional Suit 13', image: professional13, category: 'Professional', description: 'Modern office suit', tags: ['Professional', 'Modern', 'Office'], price: 1249.99 },
        { id: 'professional-14', title: 'Professional Suit 14', image: professional14, category: 'Professional', description: 'Sleek business attire', tags: ['Professional', 'Sleek', 'Business'], price: 1299.99 },
        { id: 'professional-15', title: 'Professional Suit 15', image: professional15, category: 'Professional', description: 'Executive business suit', tags: ['Professional', 'Executive', 'Business'], price: 1499.99 },
    ];

    const traditionalItems = [
        { id: 'traditional-1', title: 'Traditional Outfit 1', image: traditional1, category: 'Traditional', description: 'Elegant traditional attire', tags: ['Traditional', 'Cultural'], price: 1599.99 },
        { id: 'traditional-2', title: 'Traditional Outfit 2', image: traditional2, category: 'Traditional', description: 'Classic cultural dress', tags: ['Traditional', 'Heritage'], price: 1499.99 },
        { id: 'traditional-3', title: 'Traditional Outfit 3', image: traditional3, category: 'Traditional', description: 'Vibrant ethnic wear', tags: ['Traditional', 'Ethnic'], price: 1699.99 },
        { id: 'traditional-4', title: 'Traditional Outfit 4', image: traditional4, category: 'Traditional', description: 'Handcrafted cultural dress', tags: ['Traditional', 'Handmade'], price: 1799.99 },
        { id: 'traditional-5', title: 'Traditional Outfit 5', image: traditional5, category: 'Traditional', description: 'Royal ethnic attire', tags: ['Traditional', 'Royal'], price: 1899.99 },
        { id: 'traditional-6', title: 'Traditional Outfit 6', image: traditional6, category: 'Traditional', description: 'Classic heritage wear', tags: ['Traditional', 'Classic'], price: 1599.99 },
        { id: 'traditional-7', title: 'Traditional Outfit 7', image: traditional7, category: 'Traditional', description: 'Elegant cultural ensemble', tags: ['Traditional', 'Elegant'], price: 1699.99 },
        { id: 'traditional-8', title: 'Traditional Outfit 8', image: traditional8, category: 'Traditional', description: 'Traditional ceremonial dress', tags: ['Traditional', 'Ceremonial'], price: 1799.99 },
        { id: 'traditional-9', title: 'Traditional Outfit 9', image: traditional9, category: 'Traditional', description: 'Vibrant festival wear', tags: ['Traditional', 'Festival'], price: 1699.99 },
        { id: 'traditional-10', title: 'Traditional Outfit 10', image: traditional10, category: 'Traditional', description: 'Classic ethnic attire', tags: ['Traditional', 'Classic'], price: 1599.99 },
        { id: 'traditional-11', title: 'Traditional Outfit 11', image: traditional11, category: 'Traditional', description: 'Elegant cultural dress', tags: ['Traditional', 'Elegant'], price: 1799.99 },
        { id: 'traditional-12', title: 'Traditional Outfit 12', image: traditional12, category: 'Traditional', description: 'Royal traditional wear', tags: ['Traditional', 'Royal'], price: 1899.99 },
        { id: 'traditional-13', title: 'Traditional Outfit 13', image: traditional13, category: 'Traditional', description: 'Vibrant cultural attire', tags: ['Traditional', 'Vibrant'], price: 1699.99 },
        { id: 'traditional-14', title: 'Traditional Outfit 14', image: traditional14, category: 'Traditional', description: 'Classic heritage dress', tags: ['Traditional', 'Heritage'], price: 1799.99 },
        { id: 'traditional-15', title: 'Traditional Outfit 15', image: traditional15, category: 'Traditional', description: 'Elegant ethnic ensemble', tags: ['Traditional', 'Elegant'], price: 1899.99 },
    ];

    // Get unique categories from portfolio items
    const categories = ["All", ...new Set(portfolioItems.map(item => item.category))];

    // Filter items based on active category
    const filteredItems = activeCategory === 'All'
        ? portfolioItems
        : activeCategory === 'Casual'
            ? casualItems
            : activeCategory === 'Contemporary'
                ? contemporaryItems
                : activeCategory === 'Formal'
                    ? formalItems
                    : activeCategory === 'Luxury'
                        ? luxuryItems
                        : activeCategory === 'Party'
                            ? partyItems
                            : activeCategory === 'Professional'
                                ? professionalItems
                                : activeCategory === 'Traditional'
                                    ? traditionalItems
                                    : portfolioItems.filter(item => item.category === activeCategory);

    return (
        <section id="portfolio" className="py-24">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                        Our <span className="text-gradient">Portfolio</span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        Discover our latest creations and get inspired by our diverse range
                        of fashion designs and styling solutions.
                    </p>

                    {/* Category Filter */}
                    <div className="flex flex-wrap justify-center gap-3 mb-12">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={activeCategory === category ? "secondary" : "ghost"}
                                size="sm"
                                className="transition-luxury"
                                onClick={() => setActiveCategory(category)}
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Portfolio Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
                    {filteredItems.map((item) => (
                        <Card key={item.id} className="group overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="relative overflow-hidden aspect-[2/3] w-full">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="w-full max-w-[120px] h-8 text-xs"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleAddToCart(item);
                                        }}
                                    >
                                        Add to Cart
                                    </Button>
                                    <Button
                                        variant={isInWishlist(item.id) ? "secondary" : "outline"}
                                        size="sm"
                                        className="w-full max-w-[120px] h-8 text-xs gap-1"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleWishlistToggle(item);
                                        }}
                                    >
                                        <Heart className="h-3.5 w-3.5" fill={isInWishlist(item.id) ? "currentColor" : "none"} />
                                        {isInWishlist(item.id) ? 'Wishlisted' : 'Wishlist'}
                                    </Button>
                                </div>
                                <Badge className="absolute top-2 left-2 text-[10px] h-5 px-1.5 bg-white text-foreground hover:bg-white/90">
                                    {item.category}
                                </Badge>
                            </div>
                            <CardContent className="p-3">
                                <h3 className="text-sm font-medium line-clamp-1 mb-1">{item.title}</h3>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-semibold">₵{item.price.toFixed(2)}</span>
                                    <div className="flex items-center gap-1">
                                        {item.tags.slice(0, 2).map((tag) => (
                                            <span
                                                key={tag}
                                                className="text-[9px] px-1.5 py-0.5 bg-muted rounded-full text-muted-foreground"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Portfolio;