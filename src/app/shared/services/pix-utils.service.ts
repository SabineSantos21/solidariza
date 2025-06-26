export class PixUtils {
  static gerarPayloadPix(
    chave: string,
    nomeRecebedor: string,
    cidadeRecebedor: string,
    valor: number = 0
  ): string {
    const sanitizedKey = chave.replace(/\D/g, ''); // Remove tudo que não for número/letra

    const payloadFormatIndicator = PixUtils.formatarEMV('00', '01');
    const merchantAccountInfo = PixUtils.formatarEMV(
      '26',
      PixUtils.formatarEMV('00', 'BR.GOV.BCB.PIX') +
      PixUtils.formatarEMV('01', sanitizedKey)
    );
    const merchantCategoryCode = PixUtils.formatarEMV('52', '0000');
    const transactionCurrency = PixUtils.formatarEMV('53', '986'); // BRL
    const transactionAmount = valor > 0 ? PixUtils.formatarEMV('54', valor.toFixed(2)) : '';
    const countryCode = PixUtils.formatarEMV('58', 'BR');
    const merchantName = PixUtils.formatarEMV('59', PixUtils.removerAcentos(nomeRecebedor).substring(0, 25));
    const merchantCity = PixUtils.formatarEMV('60', PixUtils.removerAcentos(cidadeRecebedor).substring(0, 15));
    const additionalDataFieldTemplate = PixUtils.formatarEMV(
      '62',
      PixUtils.formatarEMV('05', '***') // txid fixo ***
    );

    const payloadSemCRC = payloadFormatIndicator +
      merchantAccountInfo +
      merchantCategoryCode +
      transactionCurrency +
      transactionAmount +
      countryCode +
      merchantName +
      merchantCity +
      additionalDataFieldTemplate +
      '6304'; // ID do CRC16 + placeholder

    const crc = PixUtils.crc16(payloadSemCRC).toUpperCase();
    return payloadSemCRC + crc;
  }

  private static formatarEMV(id: string, value: string): string {
    const length = value.length.toString().padStart(2, '0');
    return `${id}${length}${value}`;
  }

  private static removerAcentos(texto: string): string {
    return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
  }

  private static crc16(str: string): string {
    let crc = 0xFFFF;
    for (let i = 0; i < str.length; i++) {
      crc ^= str.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        if ((crc & 0x8000) !== 0) {
          crc = (crc << 1) ^ 0x1021;
        } else {
          crc <<= 1;
        }
      }
      crc &= 0xFFFF;
    }
    return crc.toString(16).padStart(4, '0');
  }
}
