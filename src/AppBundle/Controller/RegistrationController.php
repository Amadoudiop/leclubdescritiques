<?php
// src/AppBundle/Controller/RegistrationController.php

namespace AppBundle\Controller;

use Symfony\Component\HttpFoundation\RedirectResponse;
use FOS\UserBundle\Controller\RegistrationController as BaseController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;

class RegistrationController extends BaseController
{
    public function registerAction(Request $request)
    {
        /** @var $formFactory FactoryInterface */
        $formFactory = $this->get('fos_user.registration.form.factory');
        /** @var $userManager UserManagerInterface */
        $userManager = $this->get('fos_user.user_manager');
        /** @var $dispatcher EventDispatcherInterface */
        $dispatcher = $this->get('event_dispatcher');

        $tokenGenerator = $this->get('fos_user.util.token_generator');
        $password = substr($tokenGenerator->generateToken(), 0, 8); // 8 chars
        //var_dump($password);die;
        $email = $request->request->get('email');
        $baseUrl = $request->headers->get('host');

        if ($request->getMethod() == 'POST') {
            if (!empty($email)) {
                if(filter_var($email, FILTER_VALIDATE_EMAIL)){
                    $verifUser = $userManager->findUserByEmail($email);
                    if (null === $verifUser) {
                        $user = $userManager->createUser();
                        $user->setEmail($email);
                        $user->setUsername($email);
                        $user->setPlainPassword($password);
                        $user->setEnabled(false);
                        $user->addRole('ROLE_USER');
                        $user->setConfirmationToken($tokenGenerator->generateToken()); 
                        $user->setFirstname(''); 
                        $user->setLastname(''); 
                        $user->setDescription(''); 
                        $user->setPhoto('');          

                        $userManager->updateUser($user);

                        //on recupere le token
                        $token = $user->getConfirmationToken();

                        //on récupère le host
                        $host = $request->headers->get('host');

                        //lien activation
                        $url = $host."/activateAccount/".$token;

                        //envoie d'un mail pour activation de compte

                        $message = \Swift_Message::newInstance();
                        $message->setContentType("text/html");
                        $message->setSubject("Activation de votre compte");
                        $message->setFrom('fx.brazier@gmail.com');
                        $message->setTo($email);
                        // pour envoyer le message en HTML
                        $message->setBody("Bonjour,<br />Pour activer votre compte veuillez vous rendre ici $url"); 
                        //envoi du message
                         $this->get('mailer')->send($message);     

                        $response = ['valid' => true, 'msg' => 'Un mail vous sera envoyé pour activer votre compte']; 
                    }else{
                        $response = ['valid' => false, 'msg' => 'Votre adresse mail est déja existante'];
                    }     
                }else{
                    $response = ['valid' => false, 'msg' => 'Votre adresse mail est non valide']; 
                }
            }else{
                $response = ['valid' => false, 'msg' => 'Votre adresse mail est obligatoire'];
            }
        }else{
            $response = ['valid' => false, 'msg' => 'Une erreure est survenue, veuillez réessayer'];
        }
        
        return new JsonResponse($response);
    }
}