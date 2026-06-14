export function generateCredentials(items: { name: string; isBundle: boolean }[]) {
  const rand = (len: number) => Math.random().toString(36).substring(2, 2 + len);
  return items.flatMap((item) => {
    const services = item.isBundle
      ? item.name.split(' + ').map((s) => s.trim())
      : [item.name];
    return services.map((service) => ({
      service,
      email: `ainest_${rand(6)}@shared-access.io`,
      password: `AI@${rand(5)}${rand(3).toUpperCase()}`,
      instructions: `Log in at the official ${service} website. Change your password on first login for security.`,
    }));
  });
}
