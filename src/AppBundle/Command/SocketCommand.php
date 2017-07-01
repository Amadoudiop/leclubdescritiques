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
        $app->route('/chat-1', new Chat);
        $app->route('/chat-2', new Chat);
        $app->route('/chat-3', new Chat);
        $app->route('/chat-4', new Chat);
        $app->route('/chat-5', new Chat);
        $app->route('/chat-6', new Chat);
        $app->route('/chat-7', new Chat);
        $app->route('/chat-8', new Chat);
        $app->route('/chat-9', new Chat);
        $app->route('/chat-10', new Chat);
        $app->route('/chat-11', new Chat);
        $app->route('/chat-12', new Chat);
        $app->route('/chat-13', new Chat);
        $app->route('/chat-14', new Chat);
        $app->route('/chat-15', new Chat);
        $app->route('/chat-16', new Chat);
        $app->route('/chat-17', new Chat);
        $app->route('/chat-18', new Chat);
        $app->route('/chat-19', new Chat);
        $app->route('/chat-20', new Chat);
        
        // Run !
        $app->run();
        
        
    }
}