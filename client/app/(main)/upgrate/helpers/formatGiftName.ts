export function formatGiftName(name: string): string {
    return name.includes('#') ? name.split('#')[0] : name;
}
