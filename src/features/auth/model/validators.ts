export const validatePassword = (value: string) => {
  if (!value) return true

  if (value.length < 6) return 'Minimum number of characters 6'
  if (value.length > 20) return 'Maximum number of characters 20'

  if (!/^[A-Za-z0-9!"#$%&'()*+,-.\/:;<=>?@[\]^_`{|}~]+$/.test(value)) {
    return 'Password must contain 0-9, a-z, A-Z, ! " # $ % & \' ( ) * + , - . / : ; < = > ? @ [ \\ ] ^ _ { | } ~'
  }

  if (!/[0-9]/.test(value)) return 'Must contain number (0-9)'
  if (!/[a-z]/.test(value)) return 'Must contain lowercase letter (a-z)'
  if (!/[A-Z]/.test(value)) return 'Must contain uppercase letter (A-Z)'

  return true
}
