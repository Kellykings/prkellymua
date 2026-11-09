'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  PackageCheck,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Phone,
  MapPin,
  ExternalLink,
  X,
  Save,
  Smartphone,
  Eye,
  Receipt,
  Boxes,
} from 'lucide-react';
import type {
  PrintDeliveryOrder,
  OrderFulfillmentStatus,
} from '@/types/domain';

interface AdminOrdersSectionProps {
  initialOrders: PrintDeliveryOrder[];
}

export function AdminOrdersSection({ initialOrders }: AdminOrdersSectionProps) {
  const [orders, setOrders] = useState<PrintDeliveryOrder[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<PrintDeliveryOrder | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editStatus, setEditStatus] = useState<OrderFulfillmentStatus>('pending_verification');
  const [editAdminNotes, setEditAdminNotes] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Compute metrics
  const totalOrders = orders.length;
  const pendingCount = orders.filter((o) => o.status === 'pending_verification').length;
  const confirmedCount = orders.filter((o) => o.status === 'payment_confirmed').length;
  const dispatchedCount = orders.filter((o) => o.status === 'dispatched').length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;
  const totalRevenueXaf = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.total_price_xaf || 0), 0);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === 'all' ? true : order.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      order.order_number.toLowerCase().includes(query) ||
      order.customer_name.toLowerCase().includes(query) ||
      order.customer_email.toLowerCase().includes(query) ||
      order.customer_phone.toLowerCase().includes(query) ||
      order.delivery_city.toLowerCase().includes(query) ||
      order.delivery_address.toLowerCase().includes(query) ||
      (order.payment_reference && order.payment_reference.toLowerCase().includes(query));

    return matchesStatus && matchesSearch;
  });

  function openOrderDrawer(order: PrintDeliveryOrder) {
    setSelectedOrder(order);
    setEditStatus(order.status);
    setEditAdminNotes(order.admin_notes || '');
    setSaveMessage(null);
    setIsDrawerOpen(true);
  }

  async function handleStatusUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedOrder) return;

    setSavingStatus(true);
    setSaveMessage(null);

    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedOrder.id,
          status: editStatus,
          admin_notes: editAdminNotes,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update order');
      }

      // Update local state
      const updatedList = orders.map((o) =>
        o.id === selectedOrder.id
          ? { ...o, status: editStatus, admin_notes: editAdminNotes, updated_at: new Date().toISOString() }
          : o
      );
      setOrders(updatedList);
      setSelectedOrder({
        ...selectedOrder,
        status: editStatus,
        admin_notes: editAdminNotes,
        updated_at: new Date().toISOString(),
      });
      setSaveMessage('Order fulfillment status updated successfully.');
    } catch (err: unknown) {
      setSaveMessage(err instanceof Error ? err.message : 'Error updating order');
    } finally {
      setSavingStatus(false);
    }
  }

  async function quickAdvanceStatus(order: PrintDeliveryOrder, nextStatus: OrderFulfillmentStatus) {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: order.id,
          status: nextStatus,
        }),
      });
      if (res.ok) {
        setOrders(
          orders.map((o) =>
            o.id === order.id
              ? { ...o, status: nextStatus, updated_at: new Date().toISOString() }
              : o
          )
        );
      }
    } catch {
      // Non-blocking
    }
  }

  function getStatusBadge(status: OrderFulfillmentStatus) {
    switch (status) {
      case 'pending_verification':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3 animate-pulse" />
            <span>Pending MoMo Verification</span>
          </span>
        );
      case 'payment_confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">
            <CheckCircle2 className="w-3 h-3" />
            <span>Payment Verified</span>
          </span>
        );
      case 'dispatched':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-300">
            <Truck className="w-3 h-3" />
            <span>Dispatched / With Courier</span>
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <PackageCheck className="w-3 h-3" />
            <span>Delivered & Handed Over</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-sm text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            <X className="w-3 h-3" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return null;
    }
  }

  return (
    <div className="space-y-8">
      {/* Top Banner / SOP Instructions */}
      <div className="bg-navy-900 text-white p-6 border-l-4 border-gold-500 shadow-institutional flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="editorial-kicker-dark">LOGISTICS & PHYSICAL FULFILLMENT</div>
          <h2 className="font-serif font-bold text-xl text-white">
            Print Edition Orders & Delivery Hub
          </h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Manage incoming local purchase orders for trade paperbacks and hardcovers.
            Confirm MTN MoMo and Orange Money transaction receipts, coordinate dispatch
            with regional couriers in Yaoundé, Douala, and CEMAC provinces, and log delivery proofs.
          </p>
        </div>
        <div className="shrink-0 flex flex-wrap items-center gap-2">
          <a
            href="https://www.sokoclick.com/en/sales/new"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-gold-500 hover:bg-gold-400 text-navy-950 text-xs font-bold rounded-sm transition-colors shadow-sm"
            title="Issue Official SokoClick Sales Receipt"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>SokoClick Sales Receipt</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
          <a
            href="https://www.sokoclick.com/en/dashboard?mode=BUSINESS"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-navy-950 border border-gold-500/40 text-gold-300 hover:text-white text-xs font-semibold rounded-sm transition-colors"
            title="Manage Physical Book Inventory & Stock on SokoClick"
          >
            <Boxes className="w-3.5 h-3.5" />
            <span>SokoClick Inventory</span>
            <ExternalLink className="w-3 h-3 opacity-70" />
          </a>
          <Link
            href="/en/books/paul-biya-the-art-of-the-credible-signature"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-navy-950 border border-white/20 text-slate-200 hover:text-white text-xs font-semibold rounded-sm transition-colors"
          >
            <span>Live Book Order Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-surface-border p-4 shadow-institutional">
          <div className="text-xs font-mono text-ink-500 uppercase">Total Orders</div>
          <div className="text-2xl font-serif font-bold text-navy-900 mt-1">{totalOrders}</div>
          <div className="text-[11px] text-ink-500 mt-0.5">Physical print requests</div>
        </div>

        <div className="bg-white border border-surface-border p-4 shadow-institutional">
          <div className="text-xs font-mono text-amber-700 uppercase">Pending MoMo</div>
          <div className="text-2xl font-serif font-bold text-amber-800 mt-1">{pendingCount}</div>
          <div className="text-[11px] text-amber-700 mt-0.5">Awaiting secretariat verification</div>
        </div>

        <div className="bg-white border border-surface-border p-4 shadow-institutional">
          <div className="text-xs font-mono text-blue-700 uppercase">Verified</div>
          <div className="text-2xl font-serif font-bold text-blue-800 mt-1">{confirmedCount}</div>
          <div className="text-[11px] text-blue-700 mt-0.5">Ready for packing & courier</div>
        </div>

        <div className="bg-white border border-surface-border p-4 shadow-institutional">
          <div className="text-xs font-mono text-purple-700 uppercase">In Transit</div>
          <div className="text-2xl font-serif font-bold text-purple-800 mt-1">{dispatchedCount}</div>
          <div className="text-[11px] text-purple-700 mt-0.5">Courier in delivery transit</div>
        </div>

        <div className="bg-white border border-surface-border p-4 shadow-institutional col-span-2 lg:col-span-1">
          <div className="text-xs font-mono text-emerald-700 uppercase">Local Revenue</div>
          <div className="text-xl font-serif font-bold text-emerald-800 mt-1">
            {new Intl.NumberFormat('fr-FR').format(totalRevenueXaf)}{' '}
            <span className="text-xs font-sans font-normal">FCFA</span>
          </div>
          <div className="text-[11px] text-emerald-700 mt-0.5">{deliveredCount} successfully delivered</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-surface-border p-4 shadow-institutional flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order #, customer name, phone, city, or MoMo TxID..."
            className="w-full h-10 pl-9 pr-3 border border-surface-border bg-surface-light text-xs text-navy-900 focus:outline-none focus:border-navy-900 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-ink-500 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 border border-surface-border bg-surface-light text-xs font-medium text-navy-900 focus:outline-none focus:border-navy-900 focus:bg-white"
          >
            <option value="all">All Fulfillment Statuses</option>
            <option value="pending_verification">Pending Verification</option>
            <option value="payment_confirmed">Payment Verified</option>
            <option value="dispatched">Dispatched / In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-surface-border shadow-institutional overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <PackageCheck className="w-10 h-10 text-ink-300 mx-auto" />
            <h3 className="font-serif font-bold text-base text-navy-900">
              No Print Delivery Orders Found
            </h3>
            <p className="text-xs text-ink-500 max-w-md mx-auto">
              {orders.length === 0
                ? 'No print edition orders have been submitted yet. Physical purchases from the book detail page will automatically route here.'
                : 'No orders match the current filter or search criteria.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-surface-border bg-surface-paper text-ink-700 font-mono uppercase text-[11px]">
                  <th className="py-3 px-4 font-semibold">Order / Date</th>
                  <th className="py-3 px-4 font-semibold">Customer & Delivery</th>
                  <th className="py-3 px-4 font-semibold">Book & Format</th>
                  <th className="py-3 px-4 font-semibold">Payment / Reference</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-surface-light transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono">
                      <div className="font-bold text-navy-900">{order.order_number}</div>
                      <div className="text-[11px] text-ink-500 mt-0.5">
                        {new Date(order.created_at).toLocaleDateString()} ·{' '}
                        {new Date(order.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-navy-900">{order.customer_name}</div>
                      <div className="text-ink-600 flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3 h-3 text-bronze-600 shrink-0" />
                        <span>{order.customer_phone}</span>
                      </div>
                      <div className="text-ink-500 flex items-center gap-1.5 mt-0.5">
                        <MapPin className="w-3 h-3 text-ink-400 shrink-0" />
                        <span className="font-medium text-navy-800">{order.delivery_city}</span>: {order.delivery_address}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-serif font-semibold text-navy-900 line-clamp-1">
                        {order.book_title}
                      </div>
                      <div className="text-[11px] text-ink-600 font-mono mt-0.5">
                        {order.quantity} × {order.format_sku} ({order.format.replace('physical_', '').toUpperCase()})
                      </div>
                      <div className="text-[11px] font-bold text-navy-900 mt-0.5">
                        {new Intl.NumberFormat('fr-FR').format(order.total_price_xaf)} FCFA
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-navy-900 uppercase flex items-center gap-1">
                        <Smartphone className="w-3 h-3 text-bronze-600 shrink-0" />
                        <span>
                          {order.payment_method === 'momo'
                            ? 'MTN MoMo'
                            : order.payment_method === 'orange_money'
                            ? 'Orange Money'
                            : 'Cash Delivery'}
                        </span>
                      </div>
                      <div className="font-mono text-[11px] text-ink-600 mt-0.5 bg-surface-paper px-1.5 py-0.5 rounded border border-surface-border inline-block">
                        {order.payment_reference || 'NO_TXID'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(order.status)}
                      {order.admin_notes && (
                        <div className="text-[11px] text-ink-600 mt-1 italic line-clamp-1">
                          Note: {order.admin_notes}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {order.status === 'pending_verification' && (
                          <button
                            type="button"
                            onClick={() => quickAdvanceStatus(order, 'payment_confirmed')}
                            title="Verify MoMo Payment"
                            className="px-2 py-1 bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200 rounded text-[11px] font-semibold transition-colors"
                          >
                            Verify
                          </button>
                        )}

                        {order.status === 'payment_confirmed' && (
                          <button
                            type="button"
                            onClick={() => quickAdvanceStatus(order, 'dispatched')}
                            title="Mark Dispatched with Courier"
                            className="px-2 py-1 bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200 rounded text-[11px] font-semibold transition-colors"
                          >
                            Dispatch
                          </button>
                        )}

                        {order.status === 'dispatched' && (
                          <button
                            type="button"
                            onClick={() => quickAdvanceStatus(order, 'delivered')}
                            title="Mark Delivered"
                            className="px-2 py-1 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded text-[11px] font-semibold transition-colors"
                          >
                            Deliver
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => openOrderDrawer(order)}
                          className="p-1.5 text-navy-900 hover:bg-surface-paper rounded border border-surface-border transition-colors"
                          title="Manage Order & Logistics"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Fulfillment & Courier Detail Drawer */}
      {isDrawerOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-navy-950/60 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-xl bg-white shadow-2xl h-full overflow-y-auto flex flex-col justify-between p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-surface-border pb-4">
                <div>
                  <div className="text-xs font-mono text-ink-500 uppercase">
                    ORDER FULFILLMENT DOSSIER
                  </div>
                  <h3 className="font-serif font-bold text-lg text-navy-900">
                    {selectedOrder.order_number}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 text-ink-500 hover:text-navy-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between bg-surface-paper p-3 border border-surface-border">
                <span className="text-xs font-semibold text-ink-700">Current Status:</span>
                <div>{getStatusBadge(selectedOrder.status)}</div>
              </div>

              {/* Order Specifics */}
              <div className="space-y-3 bg-surface-light p-4 border border-surface-border text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-ink-500 block font-mono">Book Title:</span>
                    <span className="font-semibold text-navy-900">{selectedOrder.book_title}</span>
                  </div>
                  <div>
                    <span className="text-ink-500 block font-mono">Format & SKU:</span>
                    <span className="font-semibold text-navy-900">
                      {selectedOrder.format.replace('physical_', '').toUpperCase()} ({selectedOrder.format_sku})
                    </span>
                  </div>
                  <div>
                    <span className="text-ink-500 block font-mono">Quantity & Total:</span>
                    <span className="font-semibold text-navy-900">
                      {selectedOrder.quantity} copy /{' '}
                      {new Intl.NumberFormat('fr-FR').format(selectedOrder.total_price_xaf)} FCFA
                    </span>
                  </div>
                  <div>
                    <span className="text-ink-500 block font-mono">Order Placed:</span>
                    <span className="font-semibold text-navy-900">
                      {new Date(selectedOrder.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-surface-border">
                  <span className="text-ink-500 block font-mono">Payment Channel:</span>
                  <div className="font-semibold text-navy-900 uppercase">
                    {selectedOrder.payment_method === 'momo'
                      ? 'MTN Mobile Money'
                      : selectedOrder.payment_method === 'orange_money'
                      ? 'Orange Money'
                      : 'Cash on Delivery'}
                  </div>
                  <div className="font-mono text-bronze-700 mt-0.5">
                    Tx Reference: <strong>{selectedOrder.payment_reference}</strong>
                  </div>
                </div>
              </div>

              {/* Customer Coordinates & Shipping Address */}
              <div className="space-y-2.5 p-4 border border-surface-border text-xs">
                <div className="font-bold text-navy-900 uppercase font-mono text-[11px]">
                  RECIPIENT & DELIVERY COORDINATES
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-ink-500 block">Recipient Name:</span>
                    <span className="font-semibold text-navy-900">{selectedOrder.customer_name}</span>
                  </div>
                  <div>
                    <span className="text-ink-500 block">Telephone / WhatsApp:</span>
                    <a
                      href={`tel:${selectedOrder.customer_phone}`}
                      className="font-semibold text-bronze-600 underline"
                    >
                      {selectedOrder.customer_phone}
                    </a>
                  </div>
                  <div className="col-span-2">
                    <span className="text-ink-500 block">Email Address:</span>
                    <a
                      href={`mailto:${selectedOrder.customer_email}`}
                      className="font-semibold text-navy-900 underline"
                    >
                      {selectedOrder.customer_email}
                    </a>
                  </div>
                  <div className="col-span-2">
                    <span className="text-ink-500 block">City & Destination:</span>
                    <span className="font-bold text-navy-900">{selectedOrder.delivery_city}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-ink-500 block">Physical Delivery Address:</span>
                    <span className="font-medium text-navy-900">{selectedOrder.delivery_address}</span>
                  </div>
                  {selectedOrder.delivery_notes && (
                    <div className="col-span-2 bg-yellow-50 p-2 border border-yellow-200">
                      <span className="text-yellow-800 font-semibold block">Customer Notes:</span>
                      <span className="text-yellow-900">{selectedOrder.delivery_notes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* SokoClick POS Receipt & Stock Management */}
              <div className="p-4 bg-sand-50/80 border border-gold-500/50 rounded-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-gold-600" />
                    <span className="font-mono font-bold text-xs text-navy-950 uppercase">
                      SokoClick Sales Receipt &amp; Inventory Management
                    </span>
                  </div>
                  <span className="text-[10px] font-mono bg-gold-500/20 text-navy-900 px-2 py-0.5 rounded font-bold uppercase">
                    Integrated POS
                  </span>
                </div>
                <p className="text-xs text-ink-700 leading-relaxed">
                  Generate the fiscal sales receipt, record customer billing, and synchronize bookstore stock deductions for order <strong>{selectedOrder.order_number}</strong> ({selectedOrder.quantity} copy × {new Intl.NumberFormat('fr-FR').format(selectedOrder.total_price_xaf)} FCFA).
                </p>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                  <a
                    href="https://www.sokoclick.com/en/sales/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-3 py-2 bg-navy-900 hover:bg-navy-800 text-gold-400 text-xs font-semibold rounded-sm text-center flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Issue SokoClick Receipt</span>
                    <ExternalLink className="w-3 h-3 opacity-70" />
                  </a>
                  <a
                    href="https://www.sokoclick.com/en/dashboard?mode=BUSINESS"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-white border border-surface-border hover:border-navy-900 text-navy-900 text-xs font-semibold rounded-sm text-center flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Boxes className="w-3.5 h-3.5 text-bronze-600" />
                    <span>Inventory Dashboard</span>
                    <ExternalLink className="w-3 h-3 text-ink-400" />
                  </a>
                </div>
              </div>

              {/* Fulfillment Update Form */}
              <form onSubmit={handleStatusUpdate} className="space-y-3 pt-2">
                <div className="font-bold text-navy-900 uppercase font-mono text-[11px]">
                  UPDATE FULFILLMENT STATUS
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-700 mb-1">
                    Select New Status:
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as OrderFulfillmentStatus)}
                    className="w-full h-10 px-3 border border-surface-border bg-white text-xs font-semibold text-navy-900 focus:outline-none focus:border-navy-900"
                  >
                    <option value="pending_verification">Pending MoMo Verification</option>
                    <option value="payment_confirmed">Payment Confirmed & Verified</option>
                    <option value="dispatched">Dispatched (With Courier)</option>
                    <option value="delivered">Delivered to Customer</option>
                    <option value="cancelled">Cancelled / Refunded</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink-700 mb-1">
                    Logistics / Courier Dispatch Notes:
                  </label>
                  <textarea
                    rows={3}
                    value={editAdminNotes}
                    onChange={(e) => setEditAdminNotes(e.target.value)}
                    placeholder="e.g. Verified 73,955 FCFA on MTN MoMo (+237 677 22 44 66). Handed to VIP Courier Yaoundé dispatch #8912."
                    className="w-full p-2.5 border border-surface-border text-xs text-navy-900 focus:outline-none focus:border-navy-900"
                  />
                </div>

                {saveMessage && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 font-semibold">
                    {saveMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={savingStatus}
                  className="w-full h-11 bg-navy-900 hover:bg-navy-800 text-gold-400 font-semibold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingStatus ? 'Saving Status...' : 'Save Fulfillment Updates'}</span>
                </button>
              </form>
            </div>

            <div className="pt-4 border-t border-surface-border flex justify-end">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="px-4 py-2 bg-surface-paper hover:bg-surface-border text-ink-700 text-xs font-semibold rounded-sm transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
