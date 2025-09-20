import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, BORDER_RADIUS } from '../constants';

interface SettingsComponentProps {
  onBack: () => void;
  onLogout: () => void;
}

const SettingsComponent: React.FC<SettingsComponentProps> = ({ onBack, onLogout }) => {
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

  return (
    <View style={styles.container}>
      {/* Header de Ajustes */}
      <View style={styles.chatHeader}>
        <View style={styles.chatHeaderContent}>
          <TouchableOpacity 
            onPress={onBack}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <View style={styles.chatUserInfo}>
            <View style={styles.chatAvatar}>
              <Text style={styles.chatAvatarText}>⚙️</Text>
            </View>
            <View>
              <Text style={styles.chatUserName}>Ajustes</Text>
              <Text style={styles.chatUserStatus}>Configuración</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Contenido de Ajustes */}
      <ScrollView style={styles.settingsContent}>
        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>Cuenta</Text>
          
          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <Ionicons name="person-outline" size={24} color={COLORS.gray} />
              <Text style={styles.settingsItemText}>Perfil</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <Ionicons name="shield-outline" size={24} color={COLORS.gray} />
              <Text style={styles.settingsItemText}>Privacidad</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <Ionicons name="notifications-outline" size={24} color={COLORS.gray} />
              <Text style={styles.settingsItemText}>Notificaciones</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.settingsSectionTitle}>Aplicación</Text>
          
          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <Ionicons name="help-circle-outline" size={24} color={COLORS.gray} />
              <Text style={styles.settingsItemText}>Ayuda</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsItem}>
            <View style={styles.settingsItemLeft}>
              <Ionicons name="information-circle-outline" size={24} color={COLORS.gray} />
              <Text style={styles.settingsItemText}>Acerca de</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.gray} />
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <TouchableOpacity style={[styles.settingsItem, styles.logoutItem]} onPress={handleLogout}>
            <View style={styles.settingsItemLeft}>
              <Ionicons name="log-out-outline" size={24} color={COLORS.danger} />
              <Text style={[styles.settingsItemText, styles.logoutText]}>Cerrar Sesión</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  chatHeader: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayScale[200],
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
  },
  chatHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: SIZES.sm,
    marginRight: SIZES.md,
  },
  backButtonText: {
    fontSize: 20,
    color: COLORS.gray,
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
  chatAvatarText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
  },
  chatUserStatus: {
    fontSize: 14,
    color: COLORS.success,
  },
  settingsContent: {
    flex: 1,
    padding: SIZES.lg,
    paddingBottom: 80,
    backgroundColor: '#F2F2F2',
  },
  settingsSection: {
    marginBottom: SIZES.xl,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SIZES.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingsSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: SIZES.md,
    marginLeft: SIZES.sm,
    marginTop: SIZES.sm,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    paddingVertical: SIZES.md,
    paddingHorizontal: SIZES.lg,
    marginBottom: 1,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayScale[100],
    borderRadius: BORDER_RADIUS.md,
    marginHorizontal: SIZES.sm,
    marginTop: SIZES.sm,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsItemText: {
    fontSize: 16,
    color: COLORS.dark,
    marginLeft: SIZES.md,
  },
  logoutItem: {
    backgroundColor: 'transparent',
    borderRadius: BORDER_RADIUS.md,
    marginTop: SIZES.sm,
    borderBottomWidth: 0,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: SIZES.sm,
    marginBottom: SIZES.sm,
  },
  logoutText: {
    color: COLORS.danger,
    fontWeight: '500',
  },
});

export default SettingsComponent;
