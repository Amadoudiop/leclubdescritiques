<?php
namespace AppBundle\Command;

use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

// Include ratchet libs
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;

// Ratchet libs
use Ratchet\App;
// Change the namespace according to your bundle
use AppBundle\Sockets\Chat;

class SocketCommand extends Command
{
    protected function configure()
    {
        $this->setName('sockets:start-chat')
            // the short description shown while running "php bin/console list"
            ->setHelp("Starts the chat socket demo")
            // the full command description shown when running the command with
            ->setDescription('Starts the chat socket demo')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output)
    {
        $output->writeln([
            'Chat socket',// A line
            '============',// Another line
            'Starting chat, open your browser.',// Empty line
        ]);

        // The domain of your app as first parameter
        
        // Note : if you got problems during the initialization, add as third parameter '0.0.0.0'
        // to prevent any error related to localhost :
        // $app = new \Ratchet\App('sandbox', 8080,'0.0.0.0');
        // Domain as first parameter
        $app = new App('localhost', 9090,'0.0.0.0');
        // Add route to chat with the handler as second parameter
        $app->route('/chat-01', new Chat);
        $app->route('/chat-02', new Chat);
        $app->route('/chat-03', new Chat);
        $app->route('/chat-04', new Chat);
        $app->route('/chat-05', new Chat);
        $app->route('/chat-06', new Chat);
        $app->route('/chat-07', new Chat);
        $app->route('/chat-08', new Chat);
        $app->route('/chat-09', new Chat);
        $app->route('/chat-10', new Chat);

        
        // Run !
        $app->run();
        
        
    }
}