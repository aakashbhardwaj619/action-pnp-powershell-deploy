import { which } from '@actions/io';
import { exec } from '@actions/exec';

export default class PowerShellToolRunner {
    static psPath: string;

    static async init() {
        if (!PowerShellToolRunner.psPath) {
            PowerShellToolRunner.psPath = await which("powershell", true);
        }
    }

    static async executePowerShellScriptBlock(scriptBlock: string, options: any = {}): Promise<number> {
        const exitCode: number = await exec(`"${PowerShellToolRunner.psPath}" -NoLogo -NoProfile -NonInteractive -Command`,
            [scriptBlock], options);
        return exitCode;
    }
}