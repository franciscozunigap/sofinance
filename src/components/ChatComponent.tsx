import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import { COLORS, SIZES } from '../constants';

interface ChatMessage {
  id: number;
  sender: 'user' | 'sofia';
  text: string;
  timestamp: string;
}

interface ChatComponentProps {
  onBack: () => void;
  initialMessages: ChatMessage[];
  responses: string[];
}

const ChatComponent: React.FC<ChatComponentProps> = ({ 
  onBack, 
  initialMessages, 
  responses 
}) => {
  const [chatMessages, setChatMessages] = useState(initialMessages);
  const [chatInput, setChatInput] = useState('');

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        sender: 'user' as const,
        text: chatInput,
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      };
      
      setChatMessages(prev => [...prev, newMessage]);
      setChatInput('');
      
      // Respuesta automática de Sofía
      setTimeout(() => {
        const sofiaResponse = {
          id: chatMessages.length + 2,
          sender: 'sofia' as const,
          text: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        };
        
        setChatMessages(prev => [...prev, sofiaResponse]);
      }, 1500);
    }
  };

  return (
    <View style={styles.chatContainer}>
      {/* Header del Chat */}
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
              <Image 
                source={require('../../assets/avatar.png')} 
                style={styles.chatAvatarImage}
                resizeMode="contain"
              />
            </View>
            <View>
              <Text style={styles.chatUserName}>Sofía</Text>
              <Text style={styles.chatUserStatus}>En línea</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Chat Messages */}
      <ScrollView style={styles.chatMessages} contentContainerStyle={styles.chatMessagesContent}>
        {chatMessages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.sender === 'user' ? styles.userMessageContainer : styles.sofiaMessageContainer
            ]}
          >
            <View style={styles.messageContent}>
              {message.sender === 'sofia' && (
                <View style={styles.messageAvatar}>
                  <Image 
                    source={require('../../assets/avatar.png')} 
                    style={styles.messageAvatarImage}
                    resizeMode="contain"
                  />
                </View>
              )}
              
              <View style={styles.messageBubble}>
                <View
                  style={[
                    styles.messageBubbleContent,
                    message.sender === 'user' ? styles.userMessageBubble : styles.sofiaMessageBubble
                  ]}
                >
                  <Text style={[
                    styles.messageText,
                    message.sender === 'user' ? styles.userMessageText : styles.sofiaMessageText
                  ]}>
                    {message.text}
                  </Text>
                </View>
                <Text style={[
                  styles.messageTime,
                  message.sender === 'user' ? styles.userMessageTime : styles.sofiaMessageTime
                ]}>
                  {message.timestamp}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Chat Input */}
      <View style={styles.chatInput}>
        <View style={styles.chatInputContainer}>
          <TextInput
            style={styles.chatTextInput}
            value={chatInput}
            onChangeText={setChatInput}
            placeholder="Pregúntame sobre tus finanzas..."
            placeholderTextColor={COLORS.gray}
          />
          <TouchableOpacity style={styles.chatSendButton} onPress={handleSendMessage}>
            <Text style={styles.chatSendButtonText}>→</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chatContainer: {
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
  chatAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    resizeMode: 'contain',
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
  chatMessages: {
    flex: 1,
    paddingBottom: 20, // Reducido para dar más espacio al input
  },
  chatMessagesContent: {
    padding: SIZES.lg,
  },
  messageContainer: {
    marginBottom: SIZES.md,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  sofiaMessageContainer: {
    alignItems: 'flex-start',
  },
  messageContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: '80%',
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.sm,
  },
  messageAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
    resizeMode: 'contain',
  },
  messageBubble: {
    flex: 1,
  },
  messageBubbleContent: {
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: 16,
  },
  userMessageBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: 4,
  },
  sofiaMessageBubble: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.grayScale[200],
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
  },
  userMessageText: {
    color: COLORS.white,
  },
  sofiaMessageText: {
    color: COLORS.dark,
  },
  messageTime: {
    fontSize: 12,
    color: COLORS.gray,
    marginTop: SIZES.xs,
  },
  userMessageTime: {
    textAlign: 'right',
  },
  sofiaMessageTime: {
    textAlign: 'left',
  },
  chatInput: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.grayScale[200],
    padding: SIZES.lg,
    paddingBottom: 100, // Espacio para el navegador flotante
    position: 'relative',
    zIndex: 10,
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.grayScale[100],
    borderRadius: 20,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
  },
  chatTextInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.dark,
    paddingVertical: SIZES.xs,
  },
  chatSendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SIZES.sm,
  },
  chatSendButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChatComponent;
