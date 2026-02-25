/**
 * ============================================================================
 * Invoice Screen - Order Invoice / Bill Details
 * ============================================================================
 *
 * Displays a professional order invoice with:
 * - Order ID, date, status
 * - Payment method & status
 * - Delivery address
 * - Items table with pricing
 * - Price breakdown (subtotal, GST, delivery, processing fee, total)
 *
 * Receives `order` object via navigation route.params
 */

import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../styles/colors';

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Returns a color based on order status
 */
const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'pending':
            return '#F59E0B';
        case 'confirmed':
        case 'processing':
            return '#3B82F6';
        case 'out_for_delivery':
        case 'shipped':
            return '#8B5CF6';
        case 'delivered':
            return '#10B981';
        case 'cancelled':
            return '#EF4444';
        default:
            return '#6B7280';
    }
};

/**
 * Returns a color based on payment status
 */
const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'paid':
            return '#10B981';
        case 'pending':
            return '#F59E0B';
        case 'unpaid':
            return '#EF4444';
        case 'refunded':
            return '#8B5CF6';
        default:
            return '#6B7280';
    }
};

/**
 * Formats a date string to a readable format
 */
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
};

/**
 * Formats a number as Indian currency
 */
const formatCurrency = (amount) => {
    const num = parseFloat(amount) || 0;
    return `₹${num.toFixed(2)}`;
};

/**
 * Capitalizes and formats status text for display
 */
const formatStatus = (status) => {
    if (!status) return 'N/A';
    return status
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

// =============================================================================
// Sub-Components
// =============================================================================

/**
 * Status Badge Component
 */
const StatusBadge = ({ label, color }) => (
    <View style={[styles.badge, { backgroundColor: color + '18' }]}>
        <View style={[styles.badgeDot, { backgroundColor: color }]} />
        <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
);

/**
 * Section Header Component
 */
const SectionHeader = ({ icon, title }) => (
    <View style={styles.sectionHeader}>
        <Ionicons name={icon} size={18} color={Colors.primary} />
        <Text style={styles.sectionTitle}>{title}</Text>
    </View>
);

/**
 * Info Row Component - displays a label-value pair
 */
const InfoRow = ({ label, value, valueStyle }) => (
    <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[styles.infoValue, valueStyle]}>{value}</Text>
    </View>
);

/**
 * Price Row Component - displays a price line item
 */
const PriceRow = ({ label, amount, isTotal, isFree }) => (
    <View style={[styles.priceRow, isTotal && styles.priceRowTotal]}>
        <Text style={[styles.priceLabel, isTotal && styles.priceLabelTotal]}>
            {label}
        </Text>
        <Text style={[
            styles.priceAmount,
            isTotal && styles.priceAmountTotal,
            isFree && styles.priceAmountFree,
        ]}>
            {isFree ? 'FREE' : formatCurrency(amount)}
        </Text>
    </View>
);

// =============================================================================
// Main Invoice Screen Component
// =============================================================================

const InvoiceScreen = ({ navigation, route }) => {
    const { order } = route.params;

    const items = order?.items || [];
    const address = order?.address || {};

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color={Colors.TEXT.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Order Invoice</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* ============================================================ */}
                {/* Invoice Header Card                                          */}
                {/* ============================================================ */}
                <View style={styles.card}>
                    {/* Restaurant Branding */}
                    <View style={styles.brandingSection}>
                        <Text style={styles.brandEmoji}>🍳</Text>
                        <Text style={styles.brandName}>Cloud Kitchen</Text>
                        <Text style={styles.brandTagline}>Delicious food, delivered fast</Text>
                    </View>

                    <View style={styles.divider} />

                    {/* Order Info */}
                    <View style={styles.orderInfoGrid}>
                        <View style={styles.orderInfoItem}>
                            <Text style={styles.orderInfoLabel}>Order ID</Text>
                            <Text style={styles.orderInfoValue}>#{order.id}</Text>
                        </View>
                        <View style={styles.orderInfoItem}>
                            <Text style={styles.orderInfoLabel}>Order Date</Text>
                            <Text style={styles.orderInfoValue}>
                                {formatDate(order.created_at)}
                            </Text>
                        </View>
                    </View>

                    {/* Status Badges */}
                    <View style={styles.badgesRow}>
                        <StatusBadge
                            label={formatStatus(order.status)}
                            color={getStatusColor(order.status)}
                        />
                        <StatusBadge
                            label={formatStatus(order.payment_status)}
                            color={getPaymentStatusColor(order.payment_status)}
                        />
                    </View>
                </View>

                {/* ============================================================ */}
                {/* Payment Information                                          */}
                {/* ============================================================ */}
                <View style={styles.card}>
                    <SectionHeader icon="card-outline" title="Payment Information" />
                    <InfoRow
                        label="Payment Method"
                        value={order.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                    />
                    <InfoRow
                        label="Payment Status"
                        value={formatStatus(order.payment_status)}
                        valueStyle={{ color: getPaymentStatusColor(order.payment_status) }}
                    />
                </View>

                {/* ============================================================ */}
                {/* Delivery Address                                             */}
                {/* ============================================================ */}
                {address && Object.keys(address).length > 0 && (
                    <View style={styles.card}>
                        <SectionHeader icon="location-outline" title="Delivery Address" />
                        <View style={styles.addressBlock}>
                            {address.name && (
                                <Text style={styles.addressName}>{address.name}</Text>
                            )}
                            {address.phone && (
                                <View style={styles.phoneRow}>
                                    <Ionicons name="call-outline" size={14} color={Colors.TEXT.secondary} />
                                    <Text style={styles.addressPhone}>{address.phone}</Text>
                                </View>
                            )}
                            <Text style={styles.addressText}>
                                {[
                                    address.address_line1,
                                    address.city,
                                    address.state,
                                    address.zip_code,
                                ].filter(Boolean).join(', ')}
                            </Text>
                        </View>
                    </View>
                )}

                {/* ============================================================ */}
                {/* Order Items Table                                            */}
                {/* ============================================================ */}
                <View style={styles.card}>
                    <SectionHeader icon="receipt-outline" title="Order Items" />

                    {/* Table Header */}
                    <View style={styles.tableHeader}>
                        <Text style={[styles.tableHeaderText, styles.colSerial]}>#</Text>
                        <Text style={[styles.tableHeaderText, styles.colItem]}>Item</Text>
                        <Text style={[styles.tableHeaderText, styles.colPrice]}>Price</Text>
                        <Text style={[styles.tableHeaderText, styles.colQty]}>Qty</Text>
                        <Text style={[styles.tableHeaderText, styles.colSubtotal]}>Subtotal</Text>
                    </View>

                    {/* Table Rows */}
                    {items.map((item, index) => {
                        const itemSubtotal = (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0);
                        return (
                            <View
                                key={index}
                                style={[
                                    styles.tableRow,
                                    index % 2 === 0 && styles.tableRowEven,
                                    index === items.length - 1 && styles.tableRowLast,
                                ]}
                            >
                                <Text style={[styles.tableCell, styles.colSerial]}>
                                    {index + 1}
                                </Text>
                                <Text
                                    style={[styles.tableCell, styles.colItem, styles.itemName]}
                                    numberOfLines={2}
                                >
                                    {item.food_name || item.food_item?.name || 'Item'}
                                </Text>
                                <Text style={[styles.tableCell, styles.colPrice]}>
                                    {formatCurrency(item.price)}
                                </Text>
                                <Text style={[styles.tableCell, styles.colQty]}>
                                    {item.quantity}
                                </Text>
                                <Text style={[styles.tableCell, styles.colSubtotal, styles.subtotalText]}>
                                    {formatCurrency(itemSubtotal)}
                                </Text>
                            </View>
                        );
                    })}
                </View>

                {/* ============================================================ */}
                {/* Price Breakdown                                              */}
                {/* ============================================================ */}
                <View style={styles.card}>
                    <SectionHeader icon="calculator-outline" title="Price Breakdown" />

                    <PriceRow label="Subtotal" amount={order.subtotal || order.total_amount} />
                    {order.gst_amount != null && (
                        <PriceRow label="GST (18%)" amount={order.gst_amount} />
                    )}
                    {order.delivery_charge != null && (
                        <PriceRow
                            label="Delivery Charge"
                            amount={order.delivery_charge}
                            isFree={parseFloat(order.delivery_charge) === 0}
                        />
                    )}
                    {order.payment_processing_fee != null && (
                        <PriceRow
                            label="Processing Fee"
                            amount={order.payment_processing_fee}
                            isFree={parseFloat(order.payment_processing_fee) === 0}
                        />
                    )}

                    <View style={styles.totalDivider} />
                    <PriceRow label="Total Amount" amount={order.total_amount} isTotal />
                </View>

                {/* ============================================================ */}
                {/* Footer                                                       */}
                {/* ============================================================ */}
                <View style={styles.footerCard}>
                    <Text style={styles.footerEmoji}>🙏</Text>
                    <Text style={styles.footerTitle}>Thank You!</Text>
                    <Text style={styles.footerText}>
                        Thank you for ordering from Our Restaurant.
                    </Text>
                    <Text style={styles.footerText}>
                        We hope you enjoy your meal!
                    </Text>
                </View>

                {/* Bottom Spacing */}
                <View style={{ height: 30 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

// =============================================================================
// Styles
// =============================================================================

const styles = StyleSheet.create({
    // Layout
    container: {
        flex: 1,
        backgroundColor: Colors.BACKGROUND.secondary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.BACKGROUND.secondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.TEXT.primary,
    },
    headerSpacer: {
        width: 40,
    },

    // Card
    card: {
        backgroundColor: Colors.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 6,
            },
            android: {
                elevation: 2,
            },
        }),
    },

    // Branding
    brandingSection: {
        alignItems: 'center',
        paddingBottom: 16,
    },
    brandEmoji: {
        fontSize: 40,
        marginBottom: 8,
    },
    brandName: {
        fontSize: 22,
        fontWeight: '800',
        color: Colors.TEXT.primary,
        letterSpacing: 0.5,
    },
    brandTagline: {
        fontSize: 13,
        color: Colors.TEXT.secondary,
        marginTop: 2,
    },

    // Divider
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: 12,
    },

    // Order Info Grid
    orderInfoGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    orderInfoItem: {
        flex: 1,
    },
    orderInfoLabel: {
        fontSize: 12,
        color: Colors.TEXT.secondary,
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    orderInfoValue: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.TEXT.primary,
    },

    // Badges
    badgesRow: {
        flexDirection: 'row',
        gap: 10,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 20,
    },
    badgeDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        marginRight: 6,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
    },

    // Section Header
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 14,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.TEXT.primary,
        marginLeft: 8,
    },

    // Info Rows
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: Colors.BACKGROUND.secondary,
    },
    infoLabel: {
        fontSize: 14,
        color: Colors.TEXT.secondary,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.TEXT.primary,
    },

    // Address
    addressBlock: {
        backgroundColor: Colors.BACKGROUND.secondary,
        borderRadius: 8,
        padding: 12,
    },
    addressName: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.TEXT.primary,
        marginBottom: 4,
    },
    phoneRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        gap: 6,
    },
    addressPhone: {
        fontSize: 13,
        color: Colors.TEXT.secondary,
    },
    addressText: {
        fontSize: 13,
        color: Colors.TEXT.secondary,
        lineHeight: 20,
    },

    // Table
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: Colors.primary,
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginBottom: 2,
    },
    tableHeaderText: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.white,
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.BACKGROUND.secondary,
        alignItems: 'center',
    },
    tableRowEven: {
        backgroundColor: '#FAFAFA',
    },
    tableRowLast: {
        borderBottomWidth: 0,
    },
    tableCell: {
        fontSize: 13,
        color: Colors.TEXT.primary,
    },
    itemName: {
        fontWeight: '500',
    },
    subtotalText: {
        fontWeight: '600',
        color: Colors.primary,
    },

    // Column widths
    colSerial: { width: 28, textAlign: 'center' },
    colItem: { flex: 1, paddingHorizontal: 6 },
    colPrice: { width: 60, textAlign: 'right' },
    colQty: { width: 36, textAlign: 'center' },
    colSubtotal: { width: 70, textAlign: 'right' },

    // Price Breakdown
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    priceRowTotal: {
        paddingVertical: 12,
    },
    priceLabel: {
        fontSize: 14,
        color: Colors.TEXT.secondary,
    },
    priceLabelTotal: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.TEXT.primary,
    },
    priceAmount: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.TEXT.primary,
    },
    priceAmountTotal: {
        fontSize: 18,
        fontWeight: '800',
        color: Colors.primary,
    },
    priceAmountFree: {
        color: '#10B981',
        fontWeight: '700',
    },
    totalDivider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: 4,
        borderStyle: 'dashed',
    },

    // Footer
    footerCard: {
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 20,
        marginBottom: 12,
        backgroundColor: Colors.white,
        borderRadius: 12,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 6,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    footerEmoji: {
        fontSize: 32,
        marginBottom: 8,
    },
    footerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.TEXT.primary,
        marginBottom: 6,
    },
    footerText: {
        fontSize: 13,
        color: Colors.TEXT.secondary,
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default InvoiceScreen;
