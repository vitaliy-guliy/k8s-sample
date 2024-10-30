import * as k8s from '@kubernetes/client-node';

class Main {
    private config: k8s.KubeConfig;
    private api: k8s.CoreV1Api;
    
    async run(): Promise<boolean> {
        console.log('> K8S Sample');
    
        try {
            if (!process.env.DEVWORKSPACE_NAMESPACE) {
                console.error('DEVWORKSPACE_NAMESPACE environment variable is not set');
                return false;
            }

            if (!process.env.DEVWORKSPACE_POD_NAME) {
                console.error('DEVWORKSPACE_POD_NAME environment variable is not set');
                return false;
            }

            const namespace = process.env.DEVWORKSPACE_NAMESPACE;
            console.log(`> namespace: ${namespace}`);

            const podName = process.env.DEVWORKSPACE_POD_NAME;
            console.log(`> pod name: ${podName}`)

            this.config = new k8s.KubeConfig();
            this.config.loadFromDefault();

            this.api = this.config.makeApiClient(k8s.CoreV1Api);

            console.log(`>> getting namespaced Pod for [${namespace}]`);
            const { body } = await this.api.listNamespacedPod(namespace, undefined, undefined, undefined, undefined, undefined);

            for (const item of body.items) {
                if (item.metadata?.name === podName) {
                  item.spec?.containers.forEach(element => {
                    console.log(`  > found container ${element.name}`);
                  });
                }
              }
    
        } catch (err) {
          console.error('>> Error', err);
        }
    
        return true;
      }
}

(async (): Promise<void> => {
    const success = await new Main().run();
    if (!success) {
      process.exit(1);
    }
  
})();
