// Custom Alert System

class CustomAlerts {
    constructor() {
        this.toastContainer = null;
        this.activeToasts = [];
        this.createToastContainer();
    }

    createToastContainer() {
        if (!this.toastContainer) {
            this.toastContainer = document.createElement('div');
            this.toastContainer.className = 'toast-container';
            document.body.appendChild(this.toastContainer);
        }
    }

    // Główna funkcja alertu modalnego
    showAlert(options = {}) {
        const {
            type = 'info',
            title = 'Alert',
            message = '',
            confirmText = 'OK',
            cancelText = 'Cancel',
            showCancel = false,
            onConfirm = () => {},
            onCancel = () => {},
            autoClose = false,
            autoCloseTime = 3000
        } = options;

        // Usuń istniejący alert jeśli istnieje
        this.closeAlert();

        // Stwórz overlay
        const overlay = document.createElement('div');
        overlay.className = 'custom-alert-overlay';
        overlay.id = 'custom-alert-overlay';

        // Stwórz alert
        const alert = document.createElement('div');
        alert.className = `custom-alert alert-${type}`;

        // Ikona na podstawie typu
        const icons = {
            success: 'bi-check-circle-fill',
            error: 'bi-exclamation-triangle-fill',
            warning: 'bi-exclamation-circle-fill',
            info: 'bi-info-circle-fill'
        };

        alert.innerHTML = `
            <div class="alert-header">
                <div class="alert-icon">
                    <i class="bi ${icons[type]}"></i>
                </div>
                <h4 class="alert-title">${title}</h4>
            </div>
            <div class="alert-message">${message}</div>
            <div class="alert-buttons">
                ${showCancel ? `<button class="alert-btn alert-btn-secondary" id="alert-cancel">${cancelText}</button>` : ''}
                <button class="alert-btn alert-btn-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'primary'}" id="alert-confirm">${confirmText}</button>
            </div>
        `;

        overlay.appendChild(alert);
        document.body.appendChild(overlay);

        // Animacja pokazania
        setTimeout(() => {
            overlay.classList.add('show');
        }, 10);

        // Event listeners
        const confirmBtn = document.getElementById('alert-confirm');
        const cancelBtn = document.getElementById('alert-cancel');

        confirmBtn.addEventListener('click', () => {
            this.closeAlert();
            onConfirm();
        });

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.closeAlert();
                onCancel();
            });
        }

        // Zamknij przy kliknięciu na backdrop
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.closeAlert();
                onCancel();
            }
        });

        // Zamknij przy ESC
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeAlert();
                onCancel();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);

        // Auto close
        if (autoClose) {
            setTimeout(() => {
                this.closeAlert();
                onConfirm();
            }, autoCloseTime);
        }

        return overlay;
    }

    closeAlert() {
        const overlay = document.getElementById('custom-alert-overlay');
        if (overlay) {
            overlay.classList.remove('show');
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }
    }

    // Toast notifications
    showToast(options = {}) {
        const {
            type = 'info',
            message = '',
            duration = 4000,
            closable = true
        } = options;

        const toastId = 'toast-' + Date.now() + Math.random().toString(36).substr(2, 9);
        
        const toast = document.createElement('div');
        toast.className = `toast-alert toast-${type}`;
        toast.id = toastId;

        const icons = {
            success: 'bi-check-circle-fill',
            error: 'bi-exclamation-triangle-fill',
            warning: 'bi-exclamation-circle-fill',
            info: 'bi-info-circle-fill'
        };

        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon alert-icon">
                    <i class="bi ${icons[type]}"></i>
                </div>
                <div class="toast-text">${message}</div>
                ${closable ? '<button class="toast-close" aria-label="Close">&times;</button>' : ''}
            </div>
            <div class="toast-progress"></div>
        `;

        this.toastContainer.appendChild(toast);
        this.activeToasts.push({ element: toast, id: toastId });

        // Animacja pokazania
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Progress bar
        const progressBar = toast.querySelector('.toast-progress');
        if (progressBar && duration > 0) {
            progressBar.style.width = '100%';
            progressBar.style.transitionDuration = duration + 'ms';
            setTimeout(() => {
                progressBar.style.width = '0%';
            }, 50);
        }

        // Close button
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeToast(toastId);
            });
        }

        // Auto close
        if (duration > 0) {
            setTimeout(() => {
                this.closeToast(toastId);
            }, duration);
        }

        return toastId;
    }

    closeToast(toastId) {
        const toast = document.getElementById(toastId);
        if (toast) {
            toast.classList.add('hide');
            setTimeout(() => {
                toast.remove();
                this.activeToasts = this.activeToasts.filter(t => t.id !== toastId);
            }, 400);
        }
    }

    closeAllToasts() {
        this.activeToasts.forEach(toast => {
            this.closeToast(toast.id);
        });
    }

    // Convenience methods
    success(message, options = {}) {
        return this.showAlert({
            type: 'success',
            title: 'Success',
            message,
            ...options
        });
    }

    error(message, options = {}) {
        return this.showAlert({
            type: 'error',
            title: 'Error',
            message,
            ...options
        });
    }

    warning(message, options = {}) {
        return this.showAlert({
            type: 'warning',
            title: 'Warning',
            message,
            ...options
        });
    }

    info(message, options = {}) {
        return this.showAlert({
            type: 'info',
            title: 'Information',
            message,
            ...options
        });
    }

    confirm(message, options = {}) {
        return this.showAlert({
            type: 'warning',
            title: 'Confirm Action',
            message,
            showCancel: true,
            ...options
        });
    }

    // Toast convenience methods
    successToast(message, options = {}) {
        return this.showToast({
            type: 'success',
            message,
            ...options
        });
    }

    errorToast(message, options = {}) {
        return this.showToast({
            type: 'error',
            message,
            ...options
        });
    }

    warningToast(message, options = {}) {
        return this.showToast({
            type: 'warning',
            message,
            ...options
        });
    }

    infoToast(message, options = {}) {
        return this.showToast({
            type: 'info',
            message,
            ...options
        });
    }
}

// Utwórz globalną instancję
const alerts = new CustomAlerts();

// Udostępnij globalnie
window.alerts = alerts;

// Zamień standardowy alert
window.customAlert = function(message, type = 'info') {
    return alerts.showAlert({
        type: type,
        title: type.charAt(0).toUpperCase() + type.slice(1),
        message: message
    });
};

// Shorthand functions
window.showSuccess = (message, options) => alerts.success(message, options);
window.showError = (message, options) => alerts.error(message, options);
window.showWarning = (message, options) => alerts.warning(message, options);
window.showInfo = (message, options) => alerts.info(message, options);
window.showConfirm = (message, options) => alerts.confirm(message, options);

window.showSuccessToast = (message, options) => alerts.successToast(message, options);
window.showErrorToast = (message, options) => alerts.errorToast(message, options);
window.showWarningToast = (message, options) => alerts.warningToast(message, options);
window.showInfoToast = (message, options) => alerts.infoToast(message, options);

console.log('Custom Alert System initialized!');
