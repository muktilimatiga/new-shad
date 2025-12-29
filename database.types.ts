export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      customers: {
        Row: {
          alamat: string | null
          created_at: string | null
          id: number
          name: string | null
          onu_sn: string | null
          updated_at: string | null
          user_pppoe: string | null
        }
        Insert: {
          alamat?: string | null
          created_at?: string | null
          id?: number
          name?: string | null
          onu_sn?: string | null
          updated_at?: string | null
          user_pppoe?: string | null
        }
        Update: {
          alamat?: string | null
          created_at?: string | null
          id?: number
          name?: string | null
          onu_sn?: string | null
          updated_at?: string | null
          user_pppoe?: string | null
        }
        Relationships: []
      }
      data_dedicated_service: {
        Row: {
          "MITRA LEXXA DATA INDONUSA": string | null
          origin_sheet: string | null
          SERVICE: string | null
          "SID INTERCITY LEXXA - TELKOM SURABAYA": string | null
          "Unnamed: 1": string | null
          "Unnamed: 10": string | null
          "Unnamed: 11": string | null
          "Unnamed: 12": string | null
          "Unnamed: 13": string | null
          "Unnamed: 2": string | null
          "Unnamed: 3": string | null
          "Unnamed: 4": string | null
          "Unnamed: 5": string | null
          "Unnamed: 6": string | null
          "Unnamed: 7": string | null
          "Unnamed: 8": string | null
          "Unnamed: 9": string | null
        }
        Insert: {
          "MITRA LEXXA DATA INDONUSA"?: string | null
          origin_sheet?: string | null
          SERVICE?: string | null
          "SID INTERCITY LEXXA - TELKOM SURABAYA"?: string | null
          "Unnamed: 1"?: string | null
          "Unnamed: 10"?: string | null
          "Unnamed: 11"?: string | null
          "Unnamed: 12"?: string | null
          "Unnamed: 13"?: string | null
          "Unnamed: 2"?: string | null
          "Unnamed: 3"?: string | null
          "Unnamed: 4"?: string | null
          "Unnamed: 5"?: string | null
          "Unnamed: 6"?: string | null
          "Unnamed: 7"?: string | null
          "Unnamed: 8"?: string | null
          "Unnamed: 9"?: string | null
        }
        Update: {
          "MITRA LEXXA DATA INDONUSA"?: string | null
          origin_sheet?: string | null
          SERVICE?: string | null
          "SID INTERCITY LEXXA - TELKOM SURABAYA"?: string | null
          "Unnamed: 1"?: string | null
          "Unnamed: 10"?: string | null
          "Unnamed: 11"?: string | null
          "Unnamed: 12"?: string | null
          "Unnamed: 13"?: string | null
          "Unnamed: 2"?: string | null
          "Unnamed: 3"?: string | null
          "Unnamed: 4"?: string | null
          "Unnamed: 5"?: string | null
          "Unnamed: 6"?: string | null
          "Unnamed: 7"?: string | null
          "Unnamed: 8"?: string | null
          "Unnamed: 9"?: string | null
        }
        Relationships: []
      }
      data_fiber: {
        Row: {
          alamat: string | null
          customer_id: number | null
          interface: string | null
          nama: string | null
          olt_name: string | null
          olt_port: string | null
          onu_id: string | null
          onu_sn: string | null
          paket: string | null
          pppoe_password: string | null
          sheet: string | null
          updated_at: string | null
          user_pppoe: string
        }
        Insert: {
          alamat?: string | null
          customer_id?: number | null
          interface?: string | null
          nama?: string | null
          olt_name?: string | null
          olt_port?: string | null
          onu_id?: string | null
          onu_sn?: string | null
          paket?: string | null
          pppoe_password?: string | null
          sheet?: string | null
          updated_at?: string | null
          user_pppoe: string
        }
        Update: {
          alamat?: string | null
          customer_id?: number | null
          interface?: string | null
          nama?: string | null
          olt_name?: string | null
          olt_port?: string | null
          onu_id?: string | null
          onu_sn?: string | null
          paket?: string | null
          pppoe_password?: string | null
          sheet?: string | null
          updated_at?: string | null
          user_pppoe?: string
        }
        Relationships: []
      }
      data_ip_publik: {
        Row: {
          "ALOKASI IP PUBLIC": string | null
          DESKRIPSI: string | null
          IP: string | null
          origin_sheet: string | null
        }
        Insert: {
          "ALOKASI IP PUBLIC"?: string | null
          DESKRIPSI?: string | null
          IP?: string | null
          origin_sheet?: string | null
        }
        Update: {
          "ALOKASI IP PUBLIC"?: string | null
          DESKRIPSI?: string | null
          IP?: string | null
          origin_sheet?: string | null
        }
        Relationships: []
      }
      data_mitra: {
        Row: {
          "Address Originating": string | null
          Bandwidth: string | null
          IP: string | null
          MAPS: string | null
          MAPS2: string | null
          "NOMOR CONTACT": string | null
          "OPEN LIMIT": string | null
          origin_sheet: string | null
          PIC: string | null
          POP: string | null
          "PORT OLT": string | null
          "PORT SWITCH": string | null
          "PPPOE/PASS": string | null
          SERVICE: string | null
          SID: number | null
          VLAN: string | null
        }
        Insert: {
          "Address Originating"?: string | null
          Bandwidth?: string | null
          IP?: string | null
          MAPS?: string | null
          MAPS2?: string | null
          "NOMOR CONTACT"?: string | null
          "OPEN LIMIT"?: string | null
          origin_sheet?: string | null
          PIC?: string | null
          POP?: string | null
          "PORT OLT"?: string | null
          "PORT SWITCH"?: string | null
          "PPPOE/PASS"?: string | null
          SERVICE?: string | null
          SID?: number | null
          VLAN?: string | null
        }
        Update: {
          "Address Originating"?: string | null
          Bandwidth?: string | null
          IP?: string | null
          MAPS?: string | null
          MAPS2?: string | null
          "NOMOR CONTACT"?: string | null
          "OPEN LIMIT"?: string | null
          origin_sheet?: string | null
          PIC?: string | null
          POP?: string | null
          "PORT OLT"?: string | null
          "PORT SWITCH"?: string | null
          "PPPOE/PASS"?: string | null
          SERVICE?: string | null
          SID?: number | null
          VLAN?: string | null
        }
        Relationships: []
      }
      log_activity: {
        Row: {
          action: string | null
          created_at: string
          details: string | null
          id: number
          status: boolean | null
          target: string | null
          user: string | null
        }
        Insert: {
          action?: string | null
          created_at?: string
          details?: string | null
          id?: number
          status?: boolean | null
          target?: string | null
          user?: string | null
        }
        Update: {
          action?: string | null
          created_at?: string
          details?: string | null
          id?: number
          status?: boolean | null
          target?: string | null
          user?: string | null
        }
        Relationships: []
      }
      log_komplain: {
        Row: {
          action: string | null
          customer_id: number | null
          id: number
          kendala: string | null
          last_updated: string | null
          nama: string | null
          note: string | null
          onu_sn: string | null
          pic: string | null
          status: string | null
          tanggal: string | null
          tiket: string | null
          waktu: string | null
        }
        Insert: {
          action?: string | null
          customer_id?: number | null
          id?: number
          kendala?: string | null
          last_updated?: string | null
          nama?: string | null
          note?: string | null
          onu_sn?: string | null
          pic?: string | null
          status?: string | null
          tanggal?: string | null
          tiket?: string | null
          waktu?: string | null
        }
        Update: {
          action?: string | null
          customer_id?: number | null
          id?: number
          kendala?: string | null
          last_updated?: string | null
          nama?: string | null
          note?: string | null
          onu_sn?: string | null
          pic?: string | null
          status?: string | null
          tanggal?: string | null
          tiket?: string | null
          waktu?: string | null
        }
        Relationships: []
      }
      log_metro: {
        Row: {
          action_taken: string | null
          description: string | null
          downtime_duration: string | null
          downtime_minutes: number | null
          finish_time: string | null
          id: number
          month_sheet: string | null
          no_ref: number | null
          problem_detail: string | null
          service_name: string
          start_time: string | null
        }
        Insert: {
          action_taken?: string | null
          description?: string | null
          downtime_duration?: string | null
          downtime_minutes?: number | null
          finish_time?: string | null
          id?: number
          month_sheet?: string | null
          no_ref?: number | null
          problem_detail?: string | null
          service_name: string
          start_time?: string | null
        }
        Update: {
          action_taken?: string | null
          description?: string | null
          downtime_duration?: string | null
          downtime_minutes?: number | null
          finish_time?: string | null
          id?: number
          month_sheet?: string | null
          no_ref?: number | null
          problem_detail?: string | null
          service_name?: string
          start_time?: string | null
        }
        Relationships: []
      }
      snmp: {
        Row: {
          address: string | null
          customer_id: number | null
          interface: string
          last_updated: string | null
          last_uptime: string | null
          modem_type: string | null
          name: string | null
          olt_name: string
          raw_ifindex: string | null
          raw_onuid: string | null
          rx_power_dbm: number | null
          rx_power_str: string | null
          sn: string | null
          status: string | null
        }
        Insert: {
          address?: string | null
          customer_id?: number | null
          interface: string
          last_updated?: string | null
          last_uptime?: string | null
          modem_type?: string | null
          name?: string | null
          olt_name: string
          raw_ifindex?: string | null
          raw_onuid?: string | null
          rx_power_dbm?: number | null
          rx_power_str?: string | null
          sn?: string | null
          status?: string | null
        }
        Update: {
          address?: string | null
          customer_id?: number | null
          interface?: string
          last_updated?: string | null
          last_uptime?: string | null
          modem_type?: string | null
          name?: string | null
          olt_name?: string
          raw_ifindex?: string | null
          raw_onuid?: string | null
          rx_power_dbm?: number | null
          rx_power_str?: string | null
          sn?: string | null
          status?: string | null
        }
        Relationships: []
      }
      snmp_devices: {
        Row: {
          community_string: string
          host: string
          name: string
        }
        Insert: {
          community_string?: string
          host: string
          name: string
        }
        Update: {
          community_string?: string
          host?: string
          name?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          full_name: string | null
          hashed_password: string | null
          id: number
          password: string | null
          role: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          hashed_password?: string | null
          id?: number
          password?: string | null
          role?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          hashed_password?: string | null
          id?: number
          password?: string | null
          role?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      customers_view: {
        Row: {
          alamat: string | null
          customer_id: number | null
          interface: string | null
          latest_action: string | null
          latest_kendala: string | null
          latest_kendala_at: string | null
          latest_tiket: string | null
          modem_type: string | null
          nama: string | null
          olt_name: string | null
          olt_port: string | null
          onu_sn: string | null
          paket: string | null
          pppoe_password: string | null
          rx_power_str: string | null
          snmp_last_updated: string | null
          snmp_status: string | null
          user_pppoe: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
