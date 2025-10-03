import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Linking,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, BORDER_RADIUS } from '../constants';
import { useUser } from '../contexts/UserContext';

interface SettingsComponentProps {
  onBack: () => void;
  onLogout: () => void;
}

const SettingsComponent: React.FC<SettingsComponentProps> = ({ onBack, onLogout }) => {
  const { user } = useUser();
  const [showHelpModal, setShowHelpModal] = useState(false);
  const contactEmail = 'francisco.zunigap@usm.cl';

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: onLogout,
        },
      ]
    );
  };

  const handleSendEmail = () => {
    Linking.openURL(`mailto:${contactEmail}`);
  };

  return (
    <View style={styles.container}>
      {/* Header Simplificado */}
      <View style={styles.chatHeader}>
        <View style={styles.chatHeaderContent}>
          <TouchableOpacity 
            onPress={onBack}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
          </TouchableOpacity>
          <View style={styles.chatUserInfo}>
            <View style={styles.chatAvatar}>
              <Ionicons name="person" size={20} color={COLORS.white} />
            </View>
            <View>
              <Text style={styles.chatUserName}>Mi Cuenta</Text>
              <Text style={styles.chatUserStatus}>Configuración</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Contenido Simplificado */}
      <ScrollView style={styles.settingsContent} showsVerticalScrollIndicator={false}>
        {/* Información del Usuario */}
        {user && (
          <View style={styles.userInfoCard}>
            <View style={styles.userAvatarLarge}>
              <Ionicons name="person" size={32} color={COLORS.white} />
            </View>
            <Text style={styles.userName}>{user.name || 'Usuario'}</Text>
            <Text style={styles.userEmail}>{user.email || 'usuario@ejemplo.com'}</Text>
          </View>
        )}

        {/* Menu Items Simplificado */}
        <View style={styles.settingsSection}>
          {/* Ayuda */}
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={() => setShowHelpModal(true)}
          >
            <View style={styles.settingsItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#DBEAFE' }]}>
                <Ionicons name="help-circle" size={24} color={COLORS.primary} />
              </View>
              <View style={styles.itemTextContainer}>
                <Text style={styles.settingsItemText}>Ayuda</Text>
                <Text style={styles.settingsItemSubtext}>Contacta con soporte</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>

          {/* Cerrar Sesión */}
          <TouchableOpacity 
            style={[styles.settingsItem, styles.logoutItem]} 
            onPress={handleLogout}
          >
            <View style={styles.settingsItemLeft}>
              <View style={[styles.iconContainer, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="log-out" size={24} color={COLORS.danger} />
              </View>
              <View style={styles.itemTextContainer}>
                <Text style={[styles.settingsItemText, styles.logoutText]}>Cerrar Sesión</Text>
                <Text style={styles.logoutSubtext}>Salir de tu cuenta</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>SoFinance v1.0.0</Text>
        </View>
      </ScrollView>

      {/* Modal de Ayuda */}
      <Modal
        visible={showHelpModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowHelpModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconContainer}>
                <Ionicons name="mail" size={32} color={COLORS.primary} />
              </View>
              <Text style={styles.modalTitle}>¿Necesitas ayuda?</Text>
              <Text style={styles.modalSubtitle}>Contáctanos para cualquier consulta</Text>
            </View>

            <View style={styles.emailContainer}>
              <Text style={styles.emailLabel}>Correo de contacto:</Text>
              <View style={styles.emailBox}>
                <Text style={styles.emailText}>{contactEmail}</Text>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => setShowHelpModal(false)}
              >
                <Text style={styles.modalButtonTextSecondary}>Cerrar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleSendEmail}
              >
                <Ionicons name="mail-outline" size={20} color={COLORS.white} style={{ marginRight: 8 }} />
                <Text style={styles.modalButtonTextPrimary}>Enviar Email</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  chatHeader: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayScale[200],
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  chatHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: SIZES.sm,
    marginRight: SIZES.md,
  },
  chatUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
  },
  chatUserName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.dark,
  },
  chatUserStatus: {
    fontSize: 13,
    color: COLORS.gray,
  },
  settingsContent: {
    flex: 1,
    padding: SIZES.lg,
    paddingBottom: 100,
  },
  // User Info Card
  userInfoCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SIZES.xl,
    marginBottom: SIZES.lg,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  userAvatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.md,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: COLORS.gray,
  },
  // Settings Section
  settingsSection: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SIZES.sm,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.md,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: 8,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
  },
  itemTextContainer: {
    flex: 1,
  },
  settingsItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 2,
  },
  settingsItemSubtext: {
    fontSize: 13,
    color: COLORS.gray,
  },
  logoutItem: {
    marginBottom: 0,
  },
  logoutText: {
    color: COLORS.danger,
  },
  logoutSubtext: {
    color: '#FCA5A5',
  },
  // Footer
  footer: {
    marginTop: SIZES.xl,
    paddingVertical: SIZES.lg,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
  },
  emailContainer: {
    marginBottom: 24,
  },
  emailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray,
    marginBottom: 12,
  },
  emailBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: BORDER_RADIUS.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emailText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  modalButtonSecondary: {
    backgroundColor: '#F3F4F6',
  },
  modalButtonPrimary: {
    backgroundColor: COLORS.primary,
  },
  modalButtonTextSecondary: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
  },
  modalButtonTextPrimary: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default SettingsComponent;
