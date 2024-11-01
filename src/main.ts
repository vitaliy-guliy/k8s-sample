import * as k8s from '@kubernetes/client-node';

class Main {
    private config: k8s.KubeConfig;
    private api: k8s.CoreV1Api;

    async run(): Promise<boolean> {
        console.log('> K8S Sample');
        console.log('------------');

        try {
            if (!process.env.DEVWORKSPACE_NAMESPACE) {
                console.error('DEVWORKSPACE_NAMESPACE environment variable is not set');
                return false;
            }

            const namespace = process.env.DEVWORKSPACE_NAMESPACE;
            console.log(`> namespace: ${namespace}`);

            this.config = new k8s.KubeConfig();
            this.config.loadFromDefault();

            this.api = this.config.makeApiClient(k8s.CoreV1Api);

            console.log('> getting a list of pods...\n');
            const { body } = await this.api.listNamespacedPod(namespace, undefined, undefined, undefined, undefined, undefined);

            for (const item of body.items) {
                console.log(`> pod: ${item.metadata?.name}`);

                item.spec?.containers.forEach(element => {
                    console.log(`    > container: ${element.name}`);
                });
            }

        } catch (err) {
            console.error(`> Failed to get workspace pod. ${err.message}`);
            if (err.body) {
                console.error(`  > error.body.message ${err.body.message}`);
            }

            if (err.statusCode) {
                console.error(`  > error.statusCode ${err.statusCode}`);
            }

            console.error(err);
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
