import React from 'react';
import { 
  X, 
  Bell, 
  CheckCircle2, 
  Calendar, 
  Sparkles, 
  Landmark, 
  FileText,
  Clock
} from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsModalProps {
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkAllAsRead: () => void;
  onSelectNotificationScheme?: (schemeId: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  notifications,
  onClose,
  onMarkAllAsRead,
  onSelectNotificationScheme
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-400" />
            <h2 className="text-base font-bold text-white">
              Notifications & Scheme Radar
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-semibold">
            {notifications.filter((n) => !n.isRead).length} Unread Updates
          </span>
          <button
            onClick={onMarkAllAsRead}
            className="text-blue-600 hover:text-blue-800 font-bold"
          >
            Mark All as Read
          </button>
        </div>

        {/* Notifications List */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              No notifications at this moment.
            </div>
          ) : (
            notifications.map((n) => {
              const iconMap = {
                dbt_credit: Landmark,
                new_scheme: Sparkles,
                deadline: Calendar,
                doc_alert: FileText,
                status_update: Clock
              };
              const Icon = iconMap[n.type] || Bell;

              return (
                <div
                  key={n.id}
                  onClick={() => {
                    if (n.schemeId && onSelectNotificationScheme) {
                      onSelectNotificationScheme(n.schemeId);
                      onClose();
                    }
                  }}
                  className={`p-3.5 rounded-xl border transition-all ${
                    n.isRead
                      ? 'bg-white border-slate-200 opacity-80'
                      : 'bg-blue-50/50 border-blue-200 font-medium'
                  } ${n.schemeId ? 'cursor-pointer hover:border-blue-400' : ''}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                        <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                      {n.schemeId && (
                        <p className="text-[10px] text-blue-600 font-bold pt-1">
                          Click to view matching scheme →
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
